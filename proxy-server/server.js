const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Get the scheduler service URL from environment variable
const SCHEDULER_URL = process.env.SCHEDULER_SERVICE_URL || 'http://localhost:3001';
const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const RESERVED_LANDING_SEGMENTS = new Set(['dashboard', 'signin', 'login', 'register', 'landing', 'index', 'api', 'uploads', 'assets', 'scheduler']);

// Log configuration on startup
console.log('=== PROXY SERVER CONFIGURATION ===');
console.log('PORT:', PORT);
console.log('SCHEDULER_URL:', SCHEDULER_URL);
console.log('SUPABASE_URL:', SUPABASE_URL ? '[SET]' : '[NOT SET]');
console.log('SUPABASE_SERVICE_ROLE_KEY:', SUPABASE_SERVICE_ROLE_KEY ? '[SET]' : '[NOT SET]');
console.log('==================================');

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
// IMPORTANT: This must come BEFORE static file serving
app.use('/scheduler', (req, res, next) => {
  console.log(`[SCHEDULER PROXY] ==========================================`);
  console.log(`[SCHEDULER PROXY] Intercepted: ${req.method} ${req.url}`);
  console.log(`[SCHEDULER PROXY] Full Path: ${req.path}`);
  console.log(`[SCHEDULER PROXY] Query: ${JSON.stringify(req.query)}`);
  console.log(`[SCHEDULER PROXY] Cookies:`, req.headers.cookie || '[none]');
  console.log(`[SCHEDULER PROXY] Target: ${SCHEDULER_URL}`);
  console.log(`[SCHEDULER PROXY] ==========================================`);
  next();
}, createProxyMiddleware({
  target: SCHEDULER_URL,
  changeOrigin: true,
  pathRewrite: {
    '^/scheduler': '', // Remove /scheduler prefix when forwarding to Next.js
  },
  // Preserve cookies and headers - critical for Supabase auth
  cookieDomainRewrite: false,
  preserveHeaderKeyCase: true,
  onProxyReq: (proxyReq, req, res) => {
    const newPath = req.url.replace('/scheduler', '') || '/';
    console.log(`[SCHEDULER PROXY] Forwarding to: ${SCHEDULER_URL}${newPath}`);
    
    // Forward all cookies - critical for authentication
    if (req.headers.cookie) {
      proxyReq.setHeader('Cookie', req.headers.cookie);
    }
    
    // Forward authorization headers if present
    if (req.headers.authorization) {
      proxyReq.setHeader('Authorization', req.headers.authorization);
    }
  },
  onProxyRes: (proxyRes, req, res) => {
    // Forward Set-Cookie headers back to client
    const setCookie = proxyRes.headers['set-cookie'];
    if (setCookie) {
      proxyRes.headers['set-cookie'] = setCookie.map(cookie => {
        // Don't modify domain/path for cookies
        return cookie;
      });
    }
  },
  onError: (err, req, res) => {
    console.error('[SCHEDULER PROXY] ==========================================');
    console.error('[SCHEDULER PROXY] ERROR:', err.message);
    console.error('[SCHEDULER PROXY] Stack:', err.stack);
    console.error('[SCHEDULER PROXY] Target was:', SCHEDULER_URL);
    console.error('[SCHEDULER PROXY] Request:', req.method, req.url);
    console.error('[SCHEDULER PROXY] ==========================================');
    res.status(502).json({ 
      error: 'Scheduler service unavailable', 
      details: err.message,
      target: SCHEDULER_URL,
      requestUrl: req.url
    });
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

// Fallback to index.html for SPA routes (only for non-proxied routes)
app.get('*', (req, res, next) => {
  // /scheduler is handled by proxy middleware above, so this won't be reached
  // Let API routes 404 properly
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ error: 'Not found' });
  }
  
  // Serve the appropriate HTML file based on the route
  if (req.path === '/' || req.path === '/index.html') {
    return res.sendFile(path.join(staticPath, 'index.html'));
  } else if (req.path.startsWith('/dashboard')) {
    return res.sendFile(path.join(staticPath, 'dashboard.html'));
  } else if (req.path.startsWith('/landing')) {
    return res.sendFile(path.join(staticPath, 'landing.html'));
  }
  
  // For custom landing slugs (single path segment, no file extension)
  const pathSegments = req.path.split('/').filter(Boolean);
  if (pathSegments.length === 1 && !req.path.includes('.')) {
    return res.sendFile(path.join(staticPath, 'landing.html'));
  }
  
  // Default fallback
  return res.sendFile(path.join(staticPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Vena proxy server running on port ${PORT}`);
  console.log(`Proxying /scheduler/* to ${SCHEDULER_URL}`);
  console.log(`Serving static files from ${staticPath}`);
});
