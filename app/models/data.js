const { Schema, model } = require('mongoose');
const Joi = require('joi');

const championshipData = Schema({
  championship: String,
  url: [
    {
      type: String,
    },
  ],
});

const dataSchema = Schema(
  {
    data: [championshipData],
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },
  },
  { versionKey: false, timestamps: true }
);

const dataJoiSchema = Joi.object({
  url: Joi.array().items(Joi.string()).min(1).required(),
  data: Joi.array().items(Joi.object()),
});

const Data = model('data', dataSchema);

module.exports = {
  Data,
  dataJoiSchema,
};
