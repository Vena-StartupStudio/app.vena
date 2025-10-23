const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Get the scheduler service URL from environment variable
const SCHEDULER_URL = process.env.SCHEDULER_SERVICE_URL || 'http://localhost:3001';

// Proxy /scheduler/* requests to the scheduler service
app.use('/scheduler', createProxyMiddleware({
  target: SCHEDULER_URL,
  changeOrigin: true,
  pathRewrite: {
    '^/scheduler': '', // Remove /scheduler prefix when forwarding
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
