const cors = require('cors');

const corsOptions = {
  origin: [
    'https://web-store-client-silk.vercel.app/',
    'https://apple-store-client-19816.web.app',
  ],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Set-Cookie'],
  methods: ['GET', 'PUT', 'DELETE', 'POST', 'OPTIONS'],
  credentials: true,
};

const corsMiddleware = cors(corsOptions);

module.exports = { corsOptions, corsMiddleware };
