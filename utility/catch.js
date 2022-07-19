const appEroor = require("./appError");
module.exports = (funksiya) => {
  const errorFunct = (req, res, next) => {
    funksiya(req, res, next).catch((err) =>
      next(new appEroor(err.message, err.statusCode))
    );
  };
  return errorFunct;
};
