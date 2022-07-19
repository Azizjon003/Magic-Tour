module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 404;
  err.status = err.status || "Fail";
  err.message = err.message || "Not found page";

  if (process.env.NODE_ENV == "DEVELOPMENT") {
    res.status(err.statusCode).json({
      status: err.status,
      statusCode: err.statusCode,
      qator: err.stack,
      message: err.message,
    });
  } else if (process.env.NODE_ENV == "PRODUCTION") {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  }
};
