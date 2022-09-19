const createError = require('http-errors');
const { Championship } = require('../../models/data');

const getDataList = async (req, res, next) => {
  const { championship } = req.params;
  const { _id } = req.user;

  const champList = await Championship.find(
    {
      championship,
      owner: _id,
    },
    { createdAt: 0, updatedAt: 0 }
  );

  if (!champList) {
    throw createError(400, 'No such championship');
  }

  res.status(200).json({
    champList,
  });
};

module.exports = getDataList;
