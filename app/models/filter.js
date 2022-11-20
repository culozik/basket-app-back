const { Schema, model } = require('mongoose');
const Joi = require('joi');

const FilterSchema = Schema(
  {
    base: { type: String },
    group: { type: String },
    leagueNames: [{ league: { type: String } }],
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },
  },
  { versionKey: false, timestamps: true }
);

const addFilterLeagueJoiSchema = Joi.object({
  groupId: Joi.string(),
  leagueName: Joi.string(),
});

const joiSchema = {
  addFilterLeague: addFilterLeagueJoiSchema,
};
const Filter = model('filter', FilterSchema);

module.exports = {
  Filter,
  joiSchema,
};
