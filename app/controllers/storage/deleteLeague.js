const createError = require('http-errors');
const { Championship } = require('../../models/data');

const deleteLeague = async (req, res) => {
  const { leagueId } = req.params;
  const { _id } = req.user;

  const isLeagueIn = await Championship.findById({ _id: leagueId });

  if (!isLeagueIn) {
    throw createError(400, 'No such league!');
  }
  await Championship.findByIdAndDelete({ _id: leagueId });
  const response = await Championship.find({ owner: _id });

  res.status(200).json({ response });
};

module.exports = deleteLeague;
