const jwt = require('jsonwebtoken');
const createError = require('http-errors');

const { User } = require('../models/user');
const { SECRET_KEY } = process.env;

const MESSAGE = 'Not authorized';

const authenticate = async (req, res, next) => {
  try {
    const { authorization = '' } = req.headers;
    const [bearer, token] = authorization.split(' ');
    if (bearer !== 'Bearer') {
      throw createError(401, MESSAGE);
    }

    const { id } = jwt.verify(token, SECRET_KEY);
    const user = await User.findById(id);

    if (!user || !user.token) {
      throw createError(401, MESSAGE);
    }

    req.user = user;
    next();
  } catch (error) {
    if (!error.status) {
      error.status = 401;
      error.message = MESSAGE;
    }
    next(error);
  }
};

module.exports = authenticate;
