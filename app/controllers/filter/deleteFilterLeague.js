const createError = require('http-errors');
const { Filter } = require('../../models/filter');

const deleteFilterLeague = async (req, res) => {
  const { leagueId } = req.params;
  const { _id } = req.user;

  const isFilterIn = await Filter.find({ 'leagueNames._id': leagueId });

  if (!isFilterIn) {
    throw createError(400, 'No such filter params');
  }

  await Filter.findOneAndUpdate(
    {
      'leagueNames._id': leagueId,
    },
    { $pull: { leagueNames: { _id: leagueId } } }
  );

  const response = await Filter.find({ owner: _id }, { updatedAt: 0 });

  res.status(200).json({ response });
};

module.exports = deleteFilterLeague;
