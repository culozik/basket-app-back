const createError = require('http-errors');
const { Data } = require('../../models/data');

const clearDataList = async (req, res, next) => {
  const { championship } = req.params;

  const isChampIn = await Data.findOne({ championship }).exec();

  if (!isChampIn) {
    throw createError(400, 'No such championship');
  }

  await Data.findOneAndUpdate({ championship }, { data: [] });

  res.status(200).send();
};

module.exports = clearDataList;
