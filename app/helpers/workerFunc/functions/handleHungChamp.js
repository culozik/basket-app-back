const jsdom = require('jsdom');
const { JSDOM } = jsdom;

const REGEXP = require('./regExp');
const makeMatchDateObj = require('./makeMatchDateObj');
const handleTeamName = require('./handleTeamName.js');

const LINK = 'https://hunbasket.hu';

const handleHungChamp = async (url, teamNames, championship) => {
  const leagueResult = [];
  for (const address of url) {
    const matchResults = [];
    if (!address.startsWith(LINK)) continue;

    try {
      const dom = await JSDOM.fromURL(address);
      const mainDiv = dom.window.document.getElementById('boxscore_top');
      if (!mainDiv) {
        continue;
      }
      const container = mainDiv?.children[0];

      const headCount =
        container?.children[0]?.children[0]?.children[1]?.children[0];

      const headResult = headCount?.children[3]?.children[2];

      const matchScoreDiff = headResult?.children[0]?.textContent
        .replace(REGEXP.removeSpaces, '')
        .split('-')
        .sort((a, b) => b - a)
        .reduce((a, b) => Number(a) - Number(b));

      const quarters = headResult?.children[1]?.textContent
        ?.replace(REGEXP.removeBrackets, '')
        ?.split(',');

      if (quarters?.length > 5) {
        continue;
      }

      const fourthQuarterSum =
        quarters &&
        quarters[3]
          ?.split('-')
          ?.reduce(
            (a, b) => Number.parseInt(a.trim()) + Number.parseInt(b.split())
          );

      const matchDateArr = headCount?.children[0]?.textContent
        ?.split(' | ')[0]
        ?.split(' ')
        ?.map(item => item?.split('.')[0]);

      const matchDate = makeMatchDateObj(matchDateArr, championship);

      const tablesDiv = container?.children[1]?.getElementsByClassName('nobg');

      if (!tablesDiv) {
        continue;
      }

      for (const tableDiv of tablesDiv) {
        const teamNameBeforeCheck =
          tableDiv?.children[0]?.textContent.trim(' ');
        const teamName = handleTeamName(teamNames, teamNameBeforeCheck);

        const tableFooter = tableDiv?.children[1]?.tFoot?.rows[0]?.cells;
        const tableFooterNum = Array.from(tableFooter)?.map(el =>
          Number(el?.textContent)
        );

        const cellE = tableFooterNum[4] + tableFooterNum[7];
        const cellF = tableFooterNum[5] + tableFooterNum[8];
        const cellG = tableFooterNum[10];
        const cellH = tableFooterNum[11];
        const cellI = tableFooterNum[16];
        const cellJ = tableFooterNum[17];
        const cellK = tableFooterNum[20];
        const cellL = tableFooterNum[23];
        const cellM = cellF + cellH + cellJ / 2 - cellK / 2 + cellL;
        const cellN = cellE * 2 + cellG * 3 + cellI;
        const cellP = +(cellN / cellM).toFixed(2);
        const cellQ =
          quarters.length === 5
            ? 'OT'
            : (matchScoreDiff <= 10) & (fourthQuarterSum > 45)
            ? 'FS'
            : '';

        const tableData = {
          teamName,
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

        matchResults.push(tableData);
      }

      const result = {
        matchDate,
        quarters,
        matchResults,
      };
      leagueResult.push(result);
    } catch (error) {
      console.log(error);
    }
  }
  return leagueResult;
};

module.exports = handleHungChamp;
