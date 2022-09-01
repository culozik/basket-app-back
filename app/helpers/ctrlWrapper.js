const ctrlWrapper = ctrl => {
  const func = async (req, res, next) => {
    try {
      await ctrl(req, res, next);
    } catch (error) {
      error.status = 400;
      next(error);
    }
  };
  return func;
};

module.exports = ctrlWrapper;
