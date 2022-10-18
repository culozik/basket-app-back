const createError = (error, status) => {
  error.status = status;
  return error;
};

const errorFunc = errors => {
  errors.forEach(err => {
    switch (err.code) {
      case 'any.only':
        err.message = `${err.path} contain invalid value`;
        break;
      case 'any.required':
        err.message = `Поле не может быть пустым!`;
        break;
      case 'string.base':
        err.message = `${err.path} must be a string`;
        break;
      case 'string.empty':
        err.message = `Произошла ошибка! Отправлена пустая строка. Попробуйте еще раз!`;
        break;
      case 'string.pattern.base':
        err.message = `${err.path} contains an invalid data type`;
        break;
      default:
        err.message = 'Some error.';
        break;
    }
  });

  return errors;
};

module.exports = { createError, errorFunc };
