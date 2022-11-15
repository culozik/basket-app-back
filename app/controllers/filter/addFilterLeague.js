const createError = require('http-errors');
const { Filter } = require('../../models/filter');

const addFilterLeague = async (req, res, next) => {
  const { groupId, leagueName } = req.body;
  const { _id } = req.user;

  const isChampIn = await Filter.find({ owner: _id });

  if (!isChampIn) {
    throw createError(400, 'No such filter params');
  }

  await Filter.findByIdAndUpdate(
    { _id: groupId },
    {
      $push: { leagueNames: { league: leagueName } },
    }
  );

  res.status(201).send();
};

module.exports = addFilterLeague;
