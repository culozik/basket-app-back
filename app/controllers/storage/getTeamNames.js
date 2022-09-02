const createError = require('http-errors');
const { Data } = require('../../models/data');

const getTeamNames = async (req, res, next) => {
  const { championship } = req.params;
  const { _id } = req.user;

  const isChampIn = await Data.findOne({ championship, owner: _id });

  if (!isChampIn) {
    throw createError(400, 'No such championship');
  }

  res.status(200).json({
    teamNames: isChampIn.teamNames,
  });
};

module.exports = getTeamNames;
