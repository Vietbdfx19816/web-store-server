const cors = require('cors');

const corsOptions = {
  origin: [
    'https://apple-store-admin-19816.web.app',
    'https://apple-store-client-19816.web.app',
  ],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Set-Cookie'],
  methods: ['GET', 'PUT', 'DELETE', 'POST', 'OPTIONS'],
  credentials: true,
};

const corsMiddleware = cors(corsOptions);

module.exports = { corsOptions, corsMiddleware };
