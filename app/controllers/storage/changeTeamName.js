const createError = require('http-errors');
const { Championship } = require('../../models/data');

const changeTeamName = async (req, res, next) => {
  const { league, teamName } = req.body;

  const isChampIn = await Championship.findOne({
    league,
  });

  if (!isChampIn) {
    throw createError(400, 'No such championship');
  }

  const renameResult = await Championship.findOneAndUpdate(
    { league },
    {
      $set: { 'teamNames.$[elem].customName': teamName[0].customName },
    },
    {
      arrayFilters: [{ 'elem.officialName': teamName[0].officialName }],
      new: true,
    }
  );
  const teamList = {
    teamNames: renameResult.teamNames,
  };

  res.status(201).json({ teamList });
};

module.exports = changeTeamName;
