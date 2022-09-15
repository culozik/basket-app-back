const { Schema, model } = require('mongoose');
const Joi = require('joi');

const ChampionshipSchema = Schema(
  {
    championship: { type: String },
    league: [
      {
        leagueName: { type: String },
        url: [{ type: String }],
        teamNames: [
          { officialName: { type: String }, customName: { type: String } },
        ],
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

const addUrlJoiSchema = Joi.object({
  championship: Joi.string(),
  leagueName: Joi.string(),
  url: Joi.array().items(Joi.string()),
});

const Championship = model('championship', ChampionshipSchema);

module.exports = {
  Championship,
  addUrlJoiSchema,
};
