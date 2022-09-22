const { handleHungChamp, handleSpainChamp } = require('./functions');

const handleUrlParser = async (dataToParse = []) => {
  const startTime = Date.now();
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
      console.log(parseResult);
    }

    parsedData.push(leagueData);
  }

  const finishTime = Date.now();

  const result = {
    startTime,
    finishTime,
    parsedData,
  };

  return result;
};

module.exports = handleUrlParser;
