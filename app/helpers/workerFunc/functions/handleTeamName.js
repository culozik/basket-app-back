const handleTeamName = (teamNames, nameBeforeCheck) => {
  const customNameFromData = teamNames?.find(el => {
    return el.officialName.toLowerCase() === nameBeforeCheck.toLowerCase();
  })?.customName;

  const teamName =
    customNameFromData !== undefined ? customNameFromData : nameBeforeCheck;

  return teamName;
};

module.exports = handleTeamName;
