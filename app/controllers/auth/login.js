const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const createError = require('http-errors');

const { User } = require('../../models/user');
const { SECRET_KEY } = process.env;

const login = async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    throw createError(401, 'Wrong email or password');
  }

  const comparePassword = await bcrypt.compare(password, user.password);
  if (!comparePassword) {
    throw createError(401, 'Wrong email or password');
  }

  const payload = {
    id: user.id,
  };

  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '7d' });
  await User.findByIdAndUpdate(user.id, { token });

  const { nickname } = user;

  res.json({
    token,
    user: { nickname },
  });
};

module.exports = login;
