const createError = require('http-errors');
const { Championship } = require('../../models/data');

const deleteTeam = async (req, res, next) => {
  const { league, teamName, id } = req.body;

  const isChampIn = await Championship.findOne({
    league,
  });

  if (!isChampIn) {
    throw createError(400, 'No such championship');
  }

  await Championship.findOneAndUpdate(
    {
      league,
      'teamNames.$.officialName': teamName,
    },
    { $pull: { teamNames: { _id: id } } }
  );

  res.status(200).send();
};

module.exports = deleteTeam;
