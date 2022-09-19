const createError = require('http-errors');
const { Championship } = require('../../models/data');

const addTeamName = async (req, res, next) => {
  const { championship, league, teamName } = req.body;
  const { _id } = req.user;

  const champQuery = {
    championship,
    league,
    owner: _id,
  };

  const isChampIn = await Championship.findOne(champQuery);

  if (!isChampIn) {
    throw createError(400, 'No such championship');
  }
  await Championship.findOneAndUpdate(champQuery, {
    $push: {
      teamNames: {
        $each: teamName,
      },
    },
  });

  res.status(201).send();
};

module.exports = addTeamName;
