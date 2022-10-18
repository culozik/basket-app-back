const bcrypt = require('bcryptjs');
const createError = require('http-errors');

const { User } = require('../../models/user');

const signup = async (req, res, next) => {
  const { nickname, email, password } = req.body;
  const user = await User.findOne({ email });

  if (user) {
    throw createError(409, 'User already exist');
  }

  const hashPassword = await bcrypt.hash(password, 10);

  const newUser = {
    nickname,
    email,
    password: hashPassword,
  };

  await User.create(newUser);

  res.status(201).json({
    message: 'user added',
  });
};

module.exports = signup;
