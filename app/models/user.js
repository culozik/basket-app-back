const { Schema, model } = require('mongoose');

const Joi = require('joi');

const CODE_REGEXP = {
  NAME: /^\w+([.-\s]?\w)+$/,
  EMAIL: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
  PASSWORD: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{6,15}$/,
};

const userSchema = Schema(
  {
    nickname: {
      type: String,
      match: CODE_REGEXP.NAME,
      required: [true, 'Nickname is required'],
    },
    email: {
      type: String,
      match: CODE_REGEXP.EMAIL,
      required: [true, 'Email is required'],
      unique: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
    },
  },
  { versionKey: false }
);

const JoiLoginSchema = Joi.object({
  email: Joi.string().trim().required(),
  password: Joi.string().trim().required(),
});

const User = model('user', userSchema);

module.exports = { User, JoiLoginSchema };
