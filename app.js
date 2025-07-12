const { join } = require('node:path');
const { createServer } = require('http');

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Setting up .env
const dotenv = require('dotenv');
dotenv.config();
const PORT = process.env.PORT || 5000;

// Import routes
const AuthRoutes = require('./routes/auth');
const StoreRoutes = require('./routes/store');
const UserRoutes = require('./routes/user');
const AdminRoutes = require('./routes/admin');

// Import middleware
const { errorHandler } = require('./middleware/error');
const { cookieParser } = require('./middleware/cookie');
const { corsOptions } = require('./middleware/cors');

// Request listener - express application
const app = express();

// Create server
const httpServer = createServer(app);

// Setting cors

app.use(cors(corsOptions));

// Public folder
app.use('/images', express.static(join(__dirname, 'public', 'images')));

// Parse request body
app.use(express.json());

// Session setting
app.use(cookieParser);

// Path
app.use('/api/auth', AuthRoutes);

app.use('/api/store', StoreRoutes);

app.use('/api/user', UserRoutes);

app.use('/api/admin', AdminRoutes);

// Error handling
app.use(errorHandler);

// Websocket setup
const getIo = require('./sockets/socket-io');
getIo(httpServer);

// Connect database
mongoose
  .connect(process.env.NODE_MONGODB_URI)
  .then(result => {
    httpServer.listen(PORT);
  })
  .catch(err => {
    console.log(err);
  });
