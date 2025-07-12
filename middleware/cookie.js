const cookieParser = require('cookie-parser');

const cookieParserMiddleware = cookieParser(process.env.NODE_COOKIE_SECRET);

module.exports = { cookieParser: cookieParserMiddleware };
