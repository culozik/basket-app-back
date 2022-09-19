const createError = require('http-errors');
const { Championship } = require('../../models/data');

const getTeamNames = async (req, res, next) => {
  const { championship } = req.params;
  const { _id } = req.user;

  const isChampIn = await Championship.find(
    { championship, owner: _id },
    { league: 1, teamNames: 1 }
  );

  if (!isChampIn) {
    throw createError(400, 'No such championship');
  }

  res.status(200).json({
    teamNames: isChampIn,
  });
};

module.exports = getTeamNames;
