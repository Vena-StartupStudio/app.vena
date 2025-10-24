const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Get the scheduler service URL from environment variable
const rawSchedulerBase = process.env.SCHEDULER_BASE_PATH ?? '/scheduler';
const normalizeBasePath = (value) => {
  if (!value || value === '/') {
    return '/';
  }
  return `/${String(value).replace(/^\/+|\/+$/g, '')}`;
};
const SCHEDULER_BASE_PATH = normalizeBasePath(rawSchedulerBase);
const SCHEDULER_URL = process.env.SCHEDULER_SERVICE_URL || 'http://localhost:3001';
const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const RESERVED_LANDING_SEGMENTS = new Set(['dashboard', 'signin', 'login', 'register', 'landing', 'index', 'api', 'uploads', 'assets', 'scheduler', 'tasks']);

// Log configuration on startup
console.log('=== PROXY SERVER CONFIGURATION ===');
console.log('PORT:', PORT);
console.log('SCHEDULER_URL:', SCHEDULER_URL);
console.log('SCHEDULER_BASE_PATH:', SCHEDULER_BASE_PATH);
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

  const rawSlug = (slug ?? '').toString().trim();
  if (!rawSlug) {
    return null;
  }

  const candidates = Array.from(new Set([rawSlug, rawSlug.toLowerCase()].filter(Boolean)));

  const runQuery = async (candidate, comparator) => {
    const params = new URLSearchParams();
    params.append('select', 'profile_config');
    params.append('profile_config->landingPage->>slug', `${comparator}.${candidate}`);
    params.append('profile_config->landingPage->>published', 'eq.true');
    params.append('limit', '1');

    const response = await fetch(`${SUPABASE_URL}/rest/v1/registrations?${params.toString()}`, {
      headers: {
        apikey: SUPABASE_SERVICE_ROLE_KEY,
        Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        Prefer: 'return=representation,single-object',
        Accept: 'application/vnd.pgrst.object+json',
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
    if (!payload) {
      return null;
    }

    const record = Array.isArray(payload) ? payload[0] : payload;
    if (!record || typeof record !== 'object') {
      return null;
    }

    const profileConfig = record.profile_config;
    if (!profileConfig || typeof profileConfig !== 'object') {
      return null;
    }

    return profileConfig;
  };

  for (const candidate of candidates) {
    const profile = await runQuery(candidate, 'eq');
    if (profile) {
      return profile;
    }
  }

  for (const candidate of candidates) {
    const profile = await runQuery(candidate, 'ilike');
    if (profile) {
      return profile;
    }
  }

  return null;
};

// Redirect legacy /schedule* to /scheduler*
app.get('/schedule*', (req, res) => {
  const dest = req.originalUrl.replace(/^\/schedule/, '/scheduler');
  return res.redirect(301, dest);
});

// Proxy only /scheduler/* requests to the scheduler service
// IMPORTANT: This must come BEFORE static file serving
app.use('/scheduler', (req, res, next) => {
  console.log(`[SCHEDULER PROXY] ==========================================`);
  console.log(`[SCHEDULER PROXY] Intercepted: ${req.method} ${req.originalUrl}`);
  console.log(`[SCHEDULER PROXY] Full Path: ${req.path}`);
  console.log(`[SCHEDULER PROXY] Query: ${JSON.stringify(req.query)}`);
  console.log(`[SCHEDULER PROXY] Cookies:`, req.headers.cookie || '[none]');
  console.log(`[SCHEDULER PROXY] Target: ${SCHEDULER_URL}`);
  console.log(`[SCHEDULER PROXY] ==========================================`);
  next();
}, createProxyMiddleware({
  target: SCHEDULER_URL,
  changeOrigin: true,
  pathRewrite: (path) => {
    if (SCHEDULER_BASE_PATH !== '/' && path.startsWith(SCHEDULER_BASE_PATH)) {
      const rewritten = path.slice(SCHEDULER_BASE_PATH.length) || '/';
      return rewritten.startsWith('/') ? rewritten : `/${rewritten}`;
    }
    return path;
  },
  // Preserve cookies and headers - critical for Supabase auth
  cookieDomainRewrite: false,
  preserveHeaderKeyCase: true,
  timeout: 30000, // 30 second timeout
  proxyTimeout: 30000,
  onProxyReq: (proxyReq, req, res) => {
    // Compute the path sent upstream after rewrite for logging purposes
    const original = (req.originalUrl || req.url || '/');
    const newPath =
      SCHEDULER_BASE_PATH !== '/' && original.startsWith(SCHEDULER_BASE_PATH)
        ? original.slice(SCHEDULER_BASE_PATH.length) || '/'
        : original;
    console.log(`[SCHEDULER PROXY] Forwarding to: ${SCHEDULER_URL}${newPath}`);

    // Forward all cookies - critical for authentication
    if (req.headers.cookie) {
      proxyReq.setHeader('Cookie', req.headers.cookie);
    }

    // Forward authorization headers if present
    if (req.headers.authorization) {
      proxyReq.setHeader('Authorization', req.headers.authorization);
    }

    // Forward Supabase auth headers
    Object.keys(req.headers).forEach(key => {
      if (key.toLowerCase().startsWith('x-supabase') ||
          key.toLowerCase() === 'apikey') {
        proxyReq.setHeader(key, req.headers[key]);
      }
    });

    // Set proper host header
    proxyReq.setHeader('Host', new URL(SCHEDULER_URL).host);
  },
  onProxyRes: (proxyRes, req, res) => {
    // Log response status for debugging
    const status = proxyRes.statusCode;
    const location = proxyRes.headers['location'];
    console.log(`[SCHEDULER PROXY] Response from upstream: ${req.method} ${req.originalUrl} -> ${status}${location ? ` (Location: ${location})` : ''}`);

    if (location && status && [301, 302, 303, 307, 308].includes(status)) {
      let rewrittenLocation = location;
      try {
        const locUrl = new URL(location, SCHEDULER_URL);
        const schedulerHost = new URL(SCHEDULER_URL).host;
        if (locUrl.host === schedulerHost) {
          // Convert absolute URL pointing to the scheduler service into a relative path
          rewrittenLocation = locUrl.pathname + locUrl.search + locUrl.hash;
        }
      } catch {
        // Non-URL strings are handled below as relative paths
      }

      if (!rewrittenLocation.startsWith('http://') && !rewrittenLocation.startsWith('https://')) {
        let relative = rewrittenLocation.trim();
        if (!relative.startsWith('/')) {
          relative = `/${relative}`;
        }
        relative = relative.replace(/\/{2,}/g, '/');

        if (relative === '/') {
          rewrittenLocation = SCHEDULER_BASE_PATH;
        } else if (SCHEDULER_BASE_PATH === '/') {
          rewrittenLocation = relative;
        } else {
          const withBase = relative.startsWith(SCHEDULER_BASE_PATH)
            ? relative
            : `${SCHEDULER_BASE_PATH}${relative}`;
          rewrittenLocation = withBase.replace(/\/{2,}/g, '/');
        }
      }

      proxyRes.headers['location'] = rewrittenLocation;
      console.log(`[SCHEDULER PROXY] Rewriting Location header from "${location}" to "${rewrittenLocation}"`);
    }

    // Forward Set-Cookie headers back to client
    const setCookie = proxyRes.headers['set-cookie'];
    if (setCookie) {
      proxyRes.headers['set-cookie'] = setCookie.map(cookie => {
        // Rewrite domain to allow cookies to work across proxy
        return cookie.replace(/Domain=[^;]+;?/gi, '');
      });
    }

    // Add CORS headers if needed
    if (!proxyRes.headers['access-control-allow-origin']) {
      proxyRes.headers['access-control-allow-credentials'] = 'true';
    }
  },
  onError: (err, req, res) => {
    console.error('[SCHEDULER PROXY] ==========================================');
    console.error('[SCHEDULER PROXY] ERROR:', err.message);
    console.error('[SCHEDULER PROXY] Stack:', err.stack);
    console.error('[SCHEDULER PROXY] Target was:', SCHEDULER_URL);
    console.error('[SCHEDULER PROXY] Request:', req.method, req.url);
    console.error('[SCHEDULER PROXY] ==========================================');
    
    // Check if response is already sent
    if (!res.headersSent) {
      res.status(502).json({ 
        error: 'Scheduler service unavailable', 
        details: err.message,
        target: SCHEDULER_URL,
        requestUrl: req.url,
        hint: 'The scheduler service may be starting up or unavailable. Please try again in a moment.'
      });
    }
  }
}));

// Serve static files from application-page/dist
const staticPath = path.join(__dirname, '..', 'application-page', 'dist');
console.log('Serving static files from:', staticPath);

// Simple health check for platform probes
app.get('/healthz', (_req, res) => {
  res.status(200).json({
    ok: true,
    service: 'vena-application-proxy',
    schedulerTarget: SCHEDULER_URL,
    time: new Date().toISOString(),
  });
});

app.get('/api/landing/:slug', async (req, res) => {
  const rawSlug = String(req.params.slug || '').trim();

  if (!shouldServeLandingSlug(rawSlug)) {
    return res.status(400).json({ ok: false, error: 'Invalid landing page slug.' });
  }

  try {
    const profile = await fetchLandingProfile(rawSlug);

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
  } else if (req.path === '/tasks') {
    return res.sendFile(path.join(staticPath, 'index.html'));
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
