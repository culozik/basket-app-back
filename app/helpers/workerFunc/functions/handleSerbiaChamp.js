const axios = require('axios');

const makeMatchDateObj = require('./makeMatchDateObj');
const handleTeamName = require('./handleTeamName.js');

const LINK = {
  champ: 'https://lige.kss.rs/seniori',
  query: 'https://lige.kss.rs/seniori/2-muska-liga/?%257Ew=f%257E',
};
const TYPE = {
  H: 'home',
  A: 'away',
  ID: 'entityId',
  NAME: 'name',
};

const REPLACE_STR = {
  tilde: '%257E',
  and: '?',
};

const REGEXP = {
  tilde: /~/gi,
  and: /\?&/,
};

const handleSerbiaChamp = async (url, teamNames, championship, league) => {
  const leagueResult = [];
  const quarterSumCheck = league?.includes('(W)') ? 40 : 45;

  for (const address of url) {
    const encodeAddress = encodeURI(address)
      ?.replaceAll(REGEXP.tilde, REPLACE_STR.tilde)
      ?.replace(REGEXP.and, REPLACE_STR.and);

    if (!encodeAddress.startsWith(LINK.champ)) continue;
    const urlString = encodeAddress?.split(LINK.query)[1];

    if (!urlString) continue;

    const res = await axios.get(
      `https://eapi.web.prod.cloud.atriumsports.com/v1/embed/163/fixture_detail?state=${urlString}`
    );

    const matchData = res?.data?.data;
    const matchFixture = matchData?.fixture;

    const getTeamData = (bool, key) => {
      return matchFixture?.competitors?.find(
        competitor => competitor?.isHome === bool
      )?.[key];
    };

    const homeTeamId = getTeamData(true, TYPE.ID);
    const awayTeamId = getTeamData(false, TYPE.ID);
    const homeTeamNameBeforeCheck = getTeamData(true, TYPE.NAME);
    const awayTeamNameBeforeCheck = getTeamData(false, TYPE.NAME);
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
          : (matchScoreDiff <= 10) & (fourthQuarterSum > quarterSumCheck)
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

module.exports = handleSerbiaChamp;
