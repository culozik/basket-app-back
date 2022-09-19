const { Championship } = require('../../models/data');

const addLeague = async (req, res, next) => {
  const { championship, league, url } = req.body;
  const { _id } = req.user;

  const leagueQuery = {
    championship,
    league,
    owner: _id,
  };

  const isChampIn = await Championship.findOne(leagueQuery);

  if (!isChampIn) {
    await Championship.create({
      championship,
      league,
      url,
      owner: _id,
    });
  }

  await Championship.findOneAndUpdate(leagueQuery, {
    $addToSet: { url: url },
  });

  res.status(201).send();
};

module.exports = addLeague;
