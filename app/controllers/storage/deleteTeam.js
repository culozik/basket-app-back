const createError = require('http-errors');
const { Championship } = require('../../models/data');

const deleteTeam = async (req, res) => {
  const { teamId } = req.params;

  const isChampIn = await Championship.find({
    'teamNames._id': teamId,
  });
  console.log('🚀 ~ isChampIn', isChampIn);

  if (!isChampIn) {
    throw createError(400, 'No such championship');
  }

  await Championship.findOneAndUpdate(
    {
      'teamNames._id': teamId,
    },
    { $pull: { teamNames: { _id: teamId } } }
  );

  const response = await Championship.findById({ _id: isChampIn[0]._id });

  res.status(200).json({ response });
};

module.exports = deleteTeam;
