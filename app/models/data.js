const { Schema, model } = require('mongoose');
const Joi = require('joi');

const { errorFunc } = require('../helpers/errorHandler');

const ChampionshipSchema = Schema(
  {
    championship: { type: String },
    league: { type: String },
    url: [{ type: String }],
    teamNames: [
      { officialName: { type: String }, customName: { type: String } },
    ],
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },
  },
  { versionKey: false, timestamps: true }
);

const addLeagueJoiSchema = Joi.object({
  championship: Joi.string(),
  league: Joi.string(),
});

const changeLeagueNameJoiSchema = Joi.object({
  newLeagueName: Joi.string(),
});

const addUrlJoiSchema = Joi.object({
  leagueId: Joi.string(),
  url: Joi.array()
    .items(Joi.string())
    .required()
    .error(err => errorFunc(err)),
});
const addTeamNameJoiSchema = Joi.object({
  leagueId: Joi.string(),
  teamName: Joi.array().items(
    Joi.object({ officialName: Joi.string(), customName: Joi.string() })
  ),
});

const renameTeamJoiSchema = Joi.object({
  league: Joi.string(),
  teamName: Joi.array().items(
    Joi.object({ officialName: Joi.string(), customName: Joi.string() })
  ),
  id: Joi.string(),
});

const joiSchema = {
  addLeague: addLeagueJoiSchema,
  renameLeague: changeLeagueNameJoiSchema,
  addUrl: addUrlJoiSchema,
  addTeam: addTeamNameJoiSchema,
  renameTeam: renameTeamJoiSchema,
};

const Championship = model('championship', ChampionshipSchema);

module.exports = {
  Championship,
  joiSchema,
};
