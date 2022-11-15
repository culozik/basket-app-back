const { Filter } = require('../../models/filter');

const getFilterList = async (req, res, next) => {
  const { _id } = req.user;

  const filterList = await Filter.find(
    {
      owner: _id,
    },
    { createdAt: 0, updatedAt: 0 }
  );

  res.status(200).json({ filterList });
};

module.exports = getFilterList;
