module.exports.errorHandler = (error, req, res, next) => {
  // console.log(error);
  const status = error.status || 500;
  const message = error.message;
  const errors = error.errors;
  res.status(status).json({ message, errors });
};
