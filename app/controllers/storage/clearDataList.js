const { Championship } = require('../../models/data');

const clearDataList = async (req, res, next) => {
  const { _id } = req.user;

  await Championship.updateMany(
    { owner: _id },
    { $set: { 'league.$[].url': [] } }
  );

  res.status(200).send();
};

module.exports = clearDataList;
