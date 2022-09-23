const createError = require('http-errors');
const { Championship } = require('../../models/data');

const changeLeagueName = async (req, res) => {
  const { id, newLeagueName } = req.body;

  const isLeagueIn = await Championship.findById({ _id: id });

  if (!isLeagueIn) {
    throw createError(400, 'No such league!');
  }

  const renameResult = await Championship.findByIdAndUpdate(
    { _id: id },
    {
      league: newLeagueName,
    },
    { new: true }
  );

  res.status(201).json({ renameResult });
};

module.exports = changeLeagueName;
