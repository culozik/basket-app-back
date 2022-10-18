const handleUrlParser = require('../../helpers/workerFunc');

const { Championship } = require('../../models/data');

const analyzeData = async (req, res, next) => {
  const { _id } = req.user;

  const championships = await Championship.find(
    { owner: _id },
    { createdAt: 0, updatedAt: 0 }
  );

  const result = await handleUrlParser(championships);

  const { parsedData } = result;

  res.status(200).json({ parsedData });
};

module.exports = analyzeData;
