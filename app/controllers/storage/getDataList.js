const createError = require('http-errors');
const { Championship } = require('../../models/data');

const getDataList = async (req, res, next) => {
  const { championship } = req.params;
  const { _id } = req.user;
  console.log(championship);

  const isChampIn = await Championship.findOne({
    championship,
    owner: _id,
  });

  if (!isChampIn) {
    throw createError(400, 'No such championship');
  }

  const resultChemp = {
    championship: isChampIn.championship,
    league: isChampIn.league,
  };

  res.status(200).json({
    resultChemp,
  });
};

module.exports = getDataList;
