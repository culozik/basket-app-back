const axios = require('axios');

const makeMatchDateObj = require('./makeMatchDateObj');
const handleTeamName = require('./handleTeamName.js');

const LINK = {
  national: 'https://nbl.basket.lv/',
  woman: 'https://lsbl.basket.lv/',
  kalendars: 'kalendars/?~w=f~',
  NN: '120',
  WN: '117',
};

const TYPE = {
  H: 'home',
  A: 'away',
};

const handleLatviaChamp = async (url, teamNames, championship) => {
  const leagueResult = [];
  for (const address of url) {
    if (!address.startsWith(LINK.national) && !address.startsWith(LINK.woman))
      continue;

    const urlString =
      address?.split(`${LINK.national}${LINK.kalendars}`)[1] ||
      address?.split(`${LINK.woman}${LINK.kalendars}`)[1];

    const queryNumber = address.startsWith(LINK.national) ? LINK.NN : LINK.WN;

    const res = await axios.get(
      `https://eapi.web.prod.cloud.atriumsports.com/v1/embed/${queryNumber}/fixture_detail?state=${urlString}`
    );

    const matchData = res?.data?.data;
    const matchFixture = matchData?.fixture;

    const getTeamId = type => {
      return matchData?.statistics[type]?.persons[0]?.entityId;
    };

    const getTeamNameBeforeCheck = teamId => {
      return matchFixture?.competitors?.find(
        competitor => competitor?.entityId === teamId
      )?.name;
    };

    const homeTeamId = getTeamId(TYPE.H);
    const awayTeamId = getTeamId(TYPE.A);
    const homeTeamNameBeforeCheck = getTeamNameBeforeCheck(homeTeamId);
    const awayTeamNameBeforeCheck = getTeamNameBeforeCheck(awayTeamId);
    const homeTeamName = handleTeamName(teamNames, homeTeamNameBeforeCheck);
    const awayTeamName = handleTeamName(teamNames, awayTeamNameBeforeCheck);

    const getTeamQuarters = id => {
      return matchData?.periodData?.teamScores[id];
    };

    const homeTeamQuarters = getTeamQuarters(homeTeamId);
    const awayTeamQuarters = getTeamQuarters(awayTeamId);

    const quartersArr = [];
    for (let i = 0; i < homeTeamQuarters?.length; i += 1) {
      const quarterArr = `${homeTeamQuarters[i]?.score}-${awayTeamQuarters[i]?.score}`;
      quartersArr.push(quarterArr);
    }

    if (quartersArr?.length > 5) continue;

    const fourthQuarterSum = quartersArr[3]
      ?.split('-')
      ?.reduce((a, b) => Number(a) + Number(b));

    const matchScoreDiff = matchFixture?.competitors
      ?.map(competitor => Number(competitor?.score))
      ?.sort((a, b) => b - a)
      ?.reduce((a, b) => a - b);
    const matchDateFull = new Date(matchFixture?.startTimeLocal);
    const matchDate = makeMatchDateObj(matchDateFull, championship);

    const getTeamResult = type => {
      const teamData = matchData?.statistics[type]?.entity;
      const teamExtra = matchData?.statistics[type]?.extra;

      const cellE = teamData?.pointsTwoMade;
      const cellF = teamData?.pointsTwoAttempted;
      const cellG = teamData?.pointsThreeMade;
      const cellH = teamData?.pointsThreeAttempted;
      const cellI = teamData?.freeThrowsMade;
      const cellJ = teamData?.freeThrowsAttempted;
      const cellK = teamData?.reboundsOffensive - teamExtra?.reboundsOffensive;
      const cellL = teamData?.turnovers - teamExtra?.turnovers;
      const cellM = cellF + cellH + cellJ / 2 - cellK / 2 + cellL;
      const cellN = cellE * 2 + cellG * 3 + cellI;
      const cellP = +(cellN / cellM).toFixed(2);
      const cellQ =
        quartersArr?.length === 5
          ? 'OT'
          : (matchScoreDiff < 10) & (fourthQuarterSum > 45)
          ? 'FS'
          : '';

      const teamResult = {
        teamName: type === TYPE.H ? homeTeamName : awayTeamName,
        results: {
          cellE,
          cellF,
          cellG,
          cellH,
          cellI,
          cellJ,
          cellK,
          cellL,
          cellM,
          cellN,
          cellP,
          cellQ,
        },
      };
      return teamResult;
    };

    const homeTeamResult = getTeamResult(TYPE.H);
    const awayTeamResult = getTeamResult(TYPE.A);

    const matchResults = [homeTeamResult, awayTeamResult];

    const result = { matchDate, quarters: quartersArr, matchResults };
    leagueResult.push(result);
  }
  return leagueResult;
};

module.exports = handleLatviaChamp;
