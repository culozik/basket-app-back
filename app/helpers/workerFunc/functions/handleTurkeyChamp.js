const jsdom = require('jsdom');
const { JSDOM } = jsdom;

const makeMatchDateObj = require('./makeMatchDateObj');
const handleTeamName = require('./handleTeamName.js');

const LINK = {
  PL: 'https://tbf.org.tr/',
  SL: 'https://www.tbf.org.tr',
};

const handleTurkeyChamp = async (url, teamNames, championship) => {
  const leagueResult = [];
  const filterFunc = index => {
    let check = false;
    switch (index) {
      case 2:
      case 3:
      case 6:
      case 7:
      case 10:
      case 11:
      case 14:
      case 15:
        check = true;
        break;

      default:
        check = false;
        break;
    }
    return check;
  };

  for (const address of url) {
    const matchResults = [];

    if (!address.startsWith(LINK.PL) && !address.startsWith(LINK.SL)) continue;

    const statsUrl = address?.split('genel-karsilastirma')[0] + 'istatistik';

    try {
      const dom = await JSDOM.fromURL(address);
      const statsDom = await JSDOM.fromURL(statsUrl);

      const mainDiv = dom.window.document.getElementById('body_pnl');

      if (!mainDiv) {
        continue;
      }
      const container = mainDiv?.children[0];
      const headCount = container?.children[1]?.children[1];

      const teamsName = container?.children[1]?.querySelectorAll('h3');
      const headResult = headCount?.querySelectorAll('span');

      const teamNamesArr = [
        teamsName?.item(0)?.textContent?.trim(),
        teamsName?.item(1)?.textContent?.trim(),
      ];
      const matchScoreArr = [
        Number.parseInt(headResult?.item(0)?.textContent?.trim()),
        Number.parseInt(headResult?.item(1)?.textContent?.trim()),
      ];

      const matchScoreDiff = matchScoreArr
        ?.sort((a, b) => b - a)
        ?.reduce((a, b) => Number(a) - Number(b));

      const quartersSpanArray = Array.from(headResult)?.filter((item, index) =>
        filterFunc(index)
      );
      const quartersArr = [];

      for (let i = 0; i < quartersSpanArray?.length; i += 2) {
        const quarterArr = `${quartersSpanArray[i]?.textContent}-${
          quartersSpanArray[i + 1]?.textContent
        }`;
        quartersArr.push(quarterArr);
      }

      if (quartersArr?.length > 5) {
        continue;
      }

      const fourthQuarterSum = quartersArr[3]
        ?.split('-')
        ?.reduce((a, b) => Number.parseInt(a) + Number.parseInt(b));

      const matchDateArr = Array.from(
        container?.children[2]?.querySelectorAll('span')
      )
        ?.filter((item, index) => index === 1)[0]
        ?.textContent?.split(' ');

      const matchDate = makeMatchDateObj(matchDateArr, championship);

      const tablesDiv = statsDom?.window?.document
        ?.getElementsByClassName('tab-content')
        ?.item(0)
        ?.querySelectorAll('table');

      if (!tablesDiv) {
        continue;
      }

      const statsTablesArr = Array.from(tablesDiv);

      statsTablesArr?.forEach((table, index) => {
        const teamName = handleTeamName(teamNames, teamNamesArr[index]);

        const statsRowsArr = Array.from(
          table?.rows?.item(table?.rows?.length - 1)?.cells
        );

        const takimRowsArr = Array.from(
          table?.rows?.item(table?.rows?.length - 2)?.cells
        );

        const statsArr = statsRowsArr?.map(el => el?.querySelectorAll('span'));
        const takimArr = takimRowsArr?.map(el =>
          Number.parseInt(el?.textContent)
        );

        const cellE = Number.parseInt(statsArr[6]?.item(0)?.textContent);
        const cellF = Number.parseInt(statsArr[6]?.item(1)?.textContent);
        const cellG = Number.parseInt(statsArr[7]?.item(0)?.textContent);
        const cellH = Number.parseInt(statsArr[7]?.item(1)?.textContent);
        const cellI = Number.parseInt(statsArr[8]?.item(0)?.textContent);
        const cellJ = Number.parseInt(statsArr[8]?.item(1)?.textContent);
        const cellK = statsArr[10]?.item(0)?.textContent - takimArr[10];
        const cellL = statsArr[15]?.item(0)?.textContent - takimArr[15];
        const cellM = cellF + cellH + cellJ / 2 - cellK / 2 + cellL;
        const cellN = cellE * 2 + cellG * 3 + cellI;
        const cellP = +(cellN / cellM).toFixed(2);
        const cellQ =
          quartersArr.length === 5
            ? 'OT'
            : (matchScoreDiff < 10) & (fourthQuarterSum > 45)
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
      });

      const result = {
        matchDate,
        quarters: quartersArr,
        matchResults,
      };
      leagueResult.push(result);
    } catch (error) {
      console.log(error);
    }
  }
  return leagueResult;
};

module.exports = handleTurkeyChamp;
