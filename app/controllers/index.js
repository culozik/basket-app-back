// const auth = require('./auth');
const auth = require('./auth');
const user = require('./user');
const storage = require('./storage');
const worker = require('./worker');
const filter = require('./filter');

module.exports = {
  auth,
  user,
  storage,
  worker,
  filter,
};
