const createError = require('http-errors');
const { Championship } = require('../../models/data');

const addLeague = async (req, res, next) => {
  const { championship, league } = req.body;
  const { _id } = req.user;

  const leagueQuery = {
    championship,
    league,
    owner: _id,
  };

  const isChampIn = await Championship.findOne(leagueQuery);

  if (isChampIn) {
    return next(createError(409, 'Чемпионат уже существует!'));
  }

  await Championship.create({
    championship,
    league,
    owner: _id,
  });

  res.status(201).send();
};

module.exports = addLeague;
