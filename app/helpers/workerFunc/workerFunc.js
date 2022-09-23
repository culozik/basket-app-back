const { handleHungChamp, handleSpainChamp } = require('./functions');

const handleUrlParser = async (dataToParse = []) => {
  const parsedData = [];

  for (const data of dataToParse) {
    const { championship, league, url, teamNames } = data;
    const leagueData = {
      championship,
      league,
      parsedData: [],
    };

    if (championship === 'hungary') {
      const parseResult = await handleHungChamp(url, teamNames, championship);
      leagueData.parsedData = [...parseResult];
    } else {
      const parseResult = await handleSpainChamp(url, teamNames, championship);
      leagueData.parsedData = [...parseResult];
    }

    parsedData.push(leagueData);
  }

  const result = {
    parsedData,
  };

  return result;
};

module.exports = handleUrlParser;
