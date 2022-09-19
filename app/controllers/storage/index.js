const addLeague = require('./addData');
const getDataList = require('./getDataList');
const clearDataList = require('./clearDataList');
const addTeamName = require('./addTeamName');
const getTeamNames = require('./getTeamNames');
const changeTeamName = require('./changeTeamName');
const addUrl = require('./addUrl');
const deleteTeam = require('./deleteTeam');

module.exports = {
  addLeague,
  addUrl,
  getDataList,
  clearDataList,
  addTeamName,
  getTeamNames,
  changeTeamName,
  deleteTeam,
};
