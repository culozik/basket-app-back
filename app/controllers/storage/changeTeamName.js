const createError = require('http-errors');
const { Data } = require('../../models/data');

const changeTeamName = async (req, res, next) => {
  const { championship, teamName } = req.body;
  const { _id } = req.user;

  const isChampIn = await Data.findOne({ championship, owner: _id });

  if (!isChampIn) {
    throw createError(400, 'No such championship');
  }

  const newTeamName = isChampIn.teamNames.forEach(team => {
    if (team.fullname === teamName.fullname) {
      team.shortname = teamName.shortName;
    }
  });
  console.log(newTeamName);

  res.status(201).send();
};

module.exports = changeTeamName;
