const createError = require('http-errors');

const { Championship } = require('../../models/data');

const addData = async (req, res, next) => {
  const { championship, leagueName, url } = req.body;
  const { _id } = req.user;

  const champQuery = {
    championship,
    owner: _id,
  };
  const leagueQuery = {
    championship,
    'league.leagueName': leagueName,
    owner: _id,
  };
  const updateQuery = {
    championship,
    league: { $elemMatch: { leagueName: leagueName } },
  };

  const isChampIn = await Championship.findOne(champQuery);
  const isLeagueIn = await Championship.findOne(leagueQuery);

  if (!isChampIn) {
    throw createError('400', 'No such championship.');
  }

  if (isChampIn && !isLeagueIn) {
    const newLeagueSet = { leagueName, url };
    await Championship.findOneAndUpdate(champQuery, {
      $addToSet: { league: newLeagueSet },
    });
    res.status(201).send();
  }

  await Championship.findOneAndUpdate(updateQuery, {
    $addToSet: { 'league.$.url': url },
  });

  res.status(201).send();
};

module.exports = addData;
