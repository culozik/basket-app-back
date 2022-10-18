const createError = require('http-errors');
const { Championship } = require('../../models/data');

const changeLeagueName = async (req, res) => {
  const { leagueId } = req.params;
  const { newLeagueName } = req.body;

  const isLeagueIn = await Championship.findById({ _id: leagueId });

  if (!isLeagueIn) {
    throw createError(400, 'No such league!');
  }

  const renameResult = await Championship.findByIdAndUpdate(
    { _id: leagueId },
    {
      league: newLeagueName,
    },
    { new: true }
  );

  res.status(201).json({ renameResult });
};

module.exports = changeLeagueName;
