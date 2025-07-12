const cors = require('cors');

const corsOptions = {
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  methods: ['GET', 'PUT', 'DELETE', 'POST', 'OPTIONS'],
  credentials: true,
};

const corsMiddleware = cors(corsOptions);

module.exports = { corsOptions, corsMiddleware };
