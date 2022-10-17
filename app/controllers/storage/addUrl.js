const createError = require('http-errors');

const { Championship } = require('../../models/data');

const addUrl = async (req, res, next) => {
  const { leagueId, url } = req.body;
  const { _id } = req.user;

  const leagueQuery = {
    _id: leagueId,
    owner: _id,
  };

  const isChampIn = await Championship.findOne(leagueQuery);

  if (!isChampIn) {
    throw createError(400, 'No such league.');
  }

  await Championship.findOneAndUpdate(leagueQuery, {
    $addToSet: { url: url },
  });

  res.status(201).send();
};

module.exports = addUrl;
