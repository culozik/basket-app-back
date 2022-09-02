const { Data } = require('../../models/data');

const addData = async (req, res, next) => {
  const { championship, data } = req.body;
  const { _id } = req.user;

  const isChampIn = await Data.findOne({ championship, owner: _id });

  if (!isChampIn) {
    const champ = await Data.create({
      championship,
      data,
      owner: _id,
    });
    res.status(201).json({
      championship: champ.championship,
      data: champ.data,
      owner: champ.owner,
    });
    return;
  }

  const checkData = () => {
    const dataAfterCheck = [...isChampIn.data];
    data.forEach(element => {
      const filteredData = isChampIn.data.filter(val => val === element);
      if (filteredData.length < 1) {
        dataAfterCheck.push(element);
      }
    });
    return dataAfterCheck;
  };

  const newSetOfUrl = checkData();
  await Data.findOneAndUpdate(
    { championship, owner: _id },
    { data: newSetOfUrl }
  );

  res.status(201).send();
};

module.exports = addData;
