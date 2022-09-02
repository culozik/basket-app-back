const createError = require('http-errors');
const { Data } = require('../../models/data');

const getDataList = async (req, res, next) => {
  const { championship } = req.params;

  const isChampIn = await Data.findOne({ championship }).exec();

  if (!isChampIn) {
    throw createError(400, 'No such championship');
  }

  res.status(200).json({
    urlList: isChampIn.data,
  });
};

module.exports = getDataList;
