const { Schema, model } = require('mongoose');
const Joi = require('joi');

const dataSchema = Schema(
  {
    championship: { type: String },
    data: [{ type: String }],
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },
  },
  { versionKey: false, timestamps: true }
);

const dataJoiSchema = Joi.object({
  championship: Joi.string(),
  data: Joi.array().items(Joi.string()),
});

const Data = model('data', dataSchema);

module.exports = {
  Data,
  dataJoiSchema,
};
