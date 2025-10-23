const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Get the scheduler service URL from environment variable
const SCHEDULER_URL = process.env.SCHEDULER_SERVICE_URL || 'http://localhost:3001';
const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const RESERVED_LANDING_SEGMENTS = new Set(['dashboard', 'signin', 'login', 'register', 'landing', 'index', 'api', 'uploads', 'assets']);

const shouldServeLandingSlug = (slug = '') => {
  const normalized = String(slug).trim().toLowerCase();
  if (!normalized) {
    return false;
  }

  if (RESERVED_LANDING_SEGMENTS.has(normalized)) {
    return false;
  }

  return !normalized.includes('.');
};

const fetchLandingProfile = async (slug) => {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('Landing profile lookup unavailable: missing Supabase configuration.');
  }

  const params = new URLSearchParams();
  params.append('select', 'profile_config');
  params.append('profile_config->landingPage->>slug', `eq.${slug}`);
  params.append('profile_config->landingPage->>published', 'eq.true');
  params.append('limit', '1');

  const response = await fetch(`${SUPABASE_URL}/rest/v1/registrations?${params.toString()}`, {
    headers: {
      apikey: SUPABASE_SERVICE_ROLE_KEY,
      Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
      Prefer: 'return=representation,single-object',
    },
  });

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    const errorText = await response.text().catch(() => String(response.status));
    throw new Error(`Supabase returned ${response.status}: ${errorText}`);
  }

  const payload = await response.json().catch(() => null);
  if (!payload || typeof payload !== 'object') {
    return null;
  }

  return payload.profile_config || null;
};

// Proxy /scheduler/* requests to the scheduler service
app.use('/scheduler', createProxyMiddleware({
  target: SCHEDULER_URL,
  changeOrigin: true,
  pathRewrite: {
    '^/scheduler': '', // Remove /scheduler prefix when forwarding to Next.js
  },
  onProxyReq: (proxyReq, req, res) => {
    console.log(`Proxying: ${req.method} ${req.url} -> ${SCHEDULER_URL}${req.url.replace('/scheduler', '')}`);
  },
  onError: (err, req, res) => {
    console.error('Proxy error:', err);
    res.status(500).send('Scheduler service unavailable');
  }
}));

// Serve static files from application-page/dist
const staticPath = path.join(__dirname, '..', 'application-page', 'dist');
console.log('Serving static files from:', staticPath);

app.get('/api/landing/:slug', async (req, res) => {
  const rawSlug = String(req.params.slug || '').trim();

  if (!shouldServeLandingSlug(rawSlug)) {
    return res.status(400).json({ ok: false, error: 'Invalid landing page slug.' });
  }

  try {
    const profile = await fetchLandingProfile(rawSlug.toLowerCase());

    if (!profile) {
      return res.status(404).json({ ok: false, error: 'Landing page not found.' });
    }

    return res.json({ ok: true, profile });
  } catch (err) {
    console.error('Landing lookup failed:', err);
    return res.status(500).json({ ok: false, error: 'Unable to load landing page.' });
  }
});

app.use(express.static(staticPath, {
  setHeaders: (res, filePath) => {
    // Set proper MIME types
    if (filePath.endsWith('.js')) {
      res.setHeader('Content-Type', 'application/javascript');
    } else if (filePath.endsWith('.css')) {
      res.setHeader('Content-Type', 'text/css');
    }
  }
}));

// Fallback to index.html for SPA routes (except API routes and scheduler)
app.get('*', (req, res, next) => {
  // Don't fallback for /scheduler or /api routes
  if (req.path.startsWith('/scheduler') || req.path.startsWith('/api')) {
    return next();
  }
  
  // Serve the appropriate HTML file based on the route
  if (req.path === '/' || req.path === '/index.html') {
    res.sendFile(path.join(staticPath, 'index.html'));
  } else if (req.path.startsWith('/dashboard')) {
    res.sendFile(path.join(staticPath, 'dashboard.html'));
  } else if (req.path.startsWith('/landing') || req.path.length > 1) {
    res.sendFile(path.join(staticPath, 'landing.html'));
  } else {
    res.sendFile(path.join(staticPath, 'index.html'));
  }
});

app.listen(PORT, () => {
  console.log(`Vena proxy server running on port ${PORT}`);
  console.log(`Proxying /scheduler/* to ${SCHEDULER_URL}`);
  console.log(`Serving static files from ${staticPath}`);
});
