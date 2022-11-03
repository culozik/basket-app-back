const {
  handleHungChamp,
  handleSpainChamp,
  handleLatviaChamp,
  handleJapanChamp,
  handleSerbiaChamp,
  handleTurkeyChamp,
  handleBrazilChamp,
} = require('./functions');

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
    } else if (championship === 'spain') {
      const parseResult = await handleSpainChamp(url, teamNames, championship);
      leagueData.parsedData = [...parseResult];
    } else if (championship === 'latvia') {
      const parseResult = await handleLatviaChamp(url, teamNames, championship);
      leagueData.parsedData = [...parseResult];
    } else if (championship === 'japan') {
      const parseResult = await handleJapanChamp(url, teamNames, championship);
      leagueData.parsedData = [...parseResult];
    } else if (championship === 'serbia') {
      const parseResult = await handleSerbiaChamp(url, teamNames, championship);
      leagueData.parsedData = [...parseResult];
    } else if (championship === 'turkey') {
      const parseResult = await handleTurkeyChamp(url, teamNames, championship);
      leagueData.parsedData = [...parseResult];
    } else if (championship === 'brazil') {
      const parseResult = await handleBrazilChamp(url, teamNames, championship);
      leagueData.parsedData = [...parseResult];
    } else {
      console.log('Nothing');
    }

    parsedData.push(leagueData);
  }

  const result = {
    parsedData,
  };

  return result;
};

module.exports = handleUrlParser;
