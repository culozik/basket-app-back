const createError = require('http-errors');
const { Championship } = require('../../models/data');

const getTeamNames = async (req, res, next) => {
  const { leagueId } = req.params;

  const isChampIn = await Championship.findById({ _id: leagueId });

  if (!isChampIn) {
    throw createError(400, 'No such championship');
  }

  res.status(200).json({
    teamNames: isChampIn?.teamNames,
  });
};

module.exports = getTeamNames;
