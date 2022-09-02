const bcrypt = require('bcryptjs');
const createError = require('http-errors');

const { User } = require('../../models/user');

const changePassword = async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;
  const { _id } = req.user;
  const user = await User.findById(_id);
  console.log(user);

  const comparePassword = await bcrypt.compare(currentPassword, user.password);
  if (!comparePassword) {
    throw createError(401, 'Wrong  password');
  }
  const hashPassword = await bcrypt.hash(newPassword, 10);
  await User.findByIdAndUpdate(_id, { password: hashPassword });
  res.status(204).send();
};

module.exports = changePassword;
