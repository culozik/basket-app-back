const { JSDOM } = require('jsdom');

const makeMatchDateObj = require('./makeMatchDateObj');
const handleTeamName = require('./handleTeamName');

const LINK = 'https://lnb.com.br/';

const handleBrazilChamp = async (url, teamNames, championship) => {
  const leagueResult = [];

  const getTeamStats = (data, string) => {
    const stats = data?.getElementById(string)?.children[2]?.tBodies?.item(1)
      ?.rows[0]?.cells;
    const statsArr = Array.from(stats)?.map(item => item?.textContent.trim());
    return statsArr;
  };

  const getTeamColumnSum = (data, string, type) => {
    const stats = data
      ?.getElementById(string)
      ?.children[2]?.tBodies?.item(0)?.rows;
    if (type === 'RO') {
      const resultROSum = Array.from(stats)
        ?.map(item =>
          Number.parseInt(
            item?.cells
              ?.item(5)
              ?.textContent?.trim()
              ?.split(' ')[0]
              ?.split('+')[1]
          )
        )
        ?.reduce((prev, current) => prev + current, 0);

      return resultROSum;
    }

    if (type === 'ER') {
      const resultROSum = Array.from(stats)
        ?.map(item =>
          Number.parseInt(item?.cells?.item(14)?.textContent?.trim())
        )
        ?.reduce((prev, current) => prev + current, 0);

      return resultROSum;
    }
  };

  const getCellValue = (data, dataIdx, valIdx) => {
    return Number.parseInt(data[dataIdx]?.split(' ')[0]?.split('/')[valIdx]);
  };

  for (const address of url) {
    const teamResultsArr = [];
    if (!address.startsWith(LINK)) continue;
    try {
      const currentPage = await JSDOM.fromURL(address);
      const dom = currentPage.window.document;

      const homeScore = dom?.getElementById('home_score')?.textContent;
      const awayScore = dom?.getElementById('away_score')?.textContent;

      const matchScoreDiff = [
        Number.parseInt(homeScore),
        Number.parseInt(awayScore),
      ]
        ?.sort((a, b) => b - a)
        ?.reduce((a, b) => a - b);

      const quarters = dom
        ?.getElementsByClassName('score_for_quarter')
        ?.item(0)?.children;

      if (quarters?.length > 5) {
        continue;
      }

      const quartersArr = Array.from(quarters)?.map(item => {
        const homeQuarterScore = Number.parseInt(
          item?.children[0]?.textContent?.trim()
        );
        const awayQuarterScore = Number.parseInt(
          item?.children[2]?.textContent?.trim()
        );
        return [homeQuarterScore, awayQuarterScore];
      });

      const fourthQuarterSum = quartersArr[3]?.reduce((a, b) => a + b);

      const matchDateArr = dom
        ?.getElementsByClassName('infos_real_time_table')
        ?.item(0)
        ?.children[0]?.tBodies?.item(0)
        ?.rows[1]?.textContent?.trim()
        ?.split(' ')[0]
        .split('/');

      const matchDate = makeMatchDateObj(matchDateArr, championship);

      const teamNamesArrayDom = Array.from(
        dom?.getElementsByClassName('show-for-large')
      )?.slice(1);

      const teamNamesArray = teamNamesArrayDom.map(name => {
        const teamNameBeforeCheck = name?.textContent?.trim();
        const teamName = handleTeamName(teamNames, teamNameBeforeCheck);
        return teamName;
      });

      const homeResultArr = getTeamStats(dom, 'team_home_stats');
      const awayResultArr = getTeamStats(dom, 'team_away_stats');

      const homeROSum = getTeamColumnSum(dom, 'team_home_stats', 'RO');
      const homeERSum = getTeamColumnSum(dom, 'team_home_stats', 'ER');
      const awayROSum = getTeamColumnSum(dom, 'team_away_stats', 'RO');
      const awayERSum = getTeamColumnSum(dom, 'team_away_stats', 'ER');

      const handleMatchResult = (team, teamResultsArr, RO, ER) => {
        const cellE = getCellValue(teamResultsArr, 7, 0);
        const cellF = getCellValue(teamResultsArr, 7, 1);
        const cellG = getCellValue(teamResultsArr, 6, 0);
        const cellH = getCellValue(teamResultsArr, 6, 1);
        const cellI = getCellValue(teamResultsArr, 8, 0);
        const cellJ = getCellValue(teamResultsArr, 8, 1);
        const cellK = RO;
        const cellL = ER;
        const cellM = cellF + cellH + cellJ / 2 - cellK / 2 + cellL;
        const cellN = cellE * 2 + cellG * 3 + cellI;
        const cellP = +(cellN / cellM).toFixed(2);
        const cellQ =
          quarters.length === 5
            ? 'OT'
            : (matchScoreDiff < 10) & (fourthQuarterSum > 45)
            ? 'FS'
            : '';
        const teamResult = {
          teamName: team,
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

      teamNamesArray?.forEach((team, index) => {
        if (index === 0) {
          const teamMatchResult = handleMatchResult(
            team,
            homeResultArr,
            homeROSum,
            homeERSum
          );
          teamResultsArr.push(teamMatchResult);
        }
        if (index === 1) {
          const teamMatchResult = handleMatchResult(
            team,
            awayResultArr,
            awayROSum,
            awayERSum
          );
          teamResultsArr.push(teamMatchResult);
        }
      });

      const result = {
        matchDate,
        quarters: quartersArr,
        matchResults: teamResultsArr,
      };
      leagueResult.push(result);
    } catch (error) {
      console.log(error);
    }
  }
  return leagueResult;
};

module.exports = handleBrazilChamp;
