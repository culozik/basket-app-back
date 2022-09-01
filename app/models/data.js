const { Schema, model } = require('mongoose');
const Joi = require('joi');

const dataSchema = Schema(
  {
    data: [
      {
        type: String,
        ref: 'user',
      },
    ],
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },
  },
  { versionKey: false, timestamps: true }
);

const dataJoiSchema = Joi.object({
  data: Joi.array().items(Joi.string()).min(1).required(),
});

const Data = model('data', dataSchema);

module.exports = {
  Data,
  dataJoiSchema,
};
