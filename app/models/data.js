const { Schema, model } = require('mongoose');
const Joi = require('joi');

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

const addUrlJoiSchema = Joi.object({
  championship: Joi.string(),
  league: Joi.string(),
  url: Joi.array().items(Joi.string()),
});
const addTeamNameJoiSchema = Joi.object({
  championship: Joi.string(),
  league: Joi.string(),
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

const deleteTeamJoiSchema = {
  league: Joi.string(),
  teamName: Joi.string(),
  id: Joi.string(),
};

const joiSchema = {
  addLeague: addLeagueJoiSchema,
  addUrl: addUrlJoiSchema,
  addTeam: addTeamNameJoiSchema,
  renameTeam: renameTeamJoiSchema,
  deleteTeam: deleteTeamJoiSchema,
};

const Championship = model('championship', ChampionshipSchema);

module.exports = {
  Championship,
  joiSchema,
};
