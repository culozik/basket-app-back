const createError = require('http-errors');
const { Data } = require('../../models/data');

const addTeamName = async (req, res, next) => {
  const { championship, teamNames } = req.body;
  const { _id } = req.user;

  const isChampIn = await Data.findOne({ championship, owner: _id });

  if (!isChampIn) {
    throw createError(400, 'No such championship');
  }

  const checkData = () => {
    const dataAfterCheck = [...isChampIn.teamNames];
    teamNames.forEach(team => {
      const filteredData = isChampIn.teamNames.filter(
        val => val.fullname === team.fullname
      );
      if (filteredData.length < 1) {
        dataAfterCheck.push(team);
      }
    });
    return dataAfterCheck;
  };

  const newSetOfTeamNames = checkData();
  await Data.findOneAndUpdate(
    { championship, owner: _id },
    { teamNames: newSetOfTeamNames }
  );

  res.status(201).send();
};

module.exports = addTeamName;
