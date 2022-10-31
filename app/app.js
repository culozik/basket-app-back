const express = require('express');
const cors = require('cors');
require('dotenv').config;

const authRouter = require('./routes/api/auth');
const userRouter = require('./routes/api/user');
const storageRouter = require('./routes/api/dataStorage');
const workerRouter = require('./routes/api/parcer');

const app = express();

app.keepAliveTimeout = 500000;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRouter);
app.use('/api/users', userRouter);
app.use('/api/storage', storageRouter);
app.use('/api/parcer', workerRouter);

app.use((req, res) => {
  res.status(404).json({ message: 'Not found' });
});

app.use((err, req, res, next) => {
  const { status = 500, message = 'Server error' } = err;
  res.status(status).json({ message });
});

module.exports = app;
