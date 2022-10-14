const createError = require('http-errors');
const { Championship } = require('../../models/data');

const addTeamName = async (req, res, next) => {
  const { leagueId, teamName } = req.body;
  console.log('🚀 ~ teamName', teamName);
  console.log('🚀 ~ leagueId', leagueId);

  const champQuery = {
    _id: leagueId,
  };

  const isChampIn = await Championship.findById(champQuery);

  if (!isChampIn) {
    throw createError(400, 'No such championship');
  }

  await Championship.findByIdAndUpdate(champQuery, {
    $push: {
      teamNames: {
        $each: teamName,
      },
    },
  });

  res.status(201).send();
};

module.exports = addTeamName;
