const cors = require('cors');

const corsOptions = {
  origin: 'https://web-store-server-c0dc.onrender.com',
  allowedHeaders: ['Content-Type', 'Authorization'],
  methods: ['GET', 'PUT', 'DELETE', 'POST', 'OPTIONS'],
  credentials: true,
};

const corsMiddleware = cors(corsOptions);

module.exports = { corsOptions, corsMiddleware };
