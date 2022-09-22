const axios = require('axios');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;

const REGEXP = require('./regExp');
const makeMatchDateObj = require('./makeMatchDateObj');

const handleHungChamp = async (url, teamNames, championship) => {
  const leagueResult = [];
  for (const address of url) {
    const response = await axios.get(address);
    const currentPage = response.data;
    const dom = new JSDOM(currentPage);

    //   Получение content Div
    const mainDiv = dom.window.document.getElementById('boxscore_top');

    if (!mainDiv) {
      continue;
    }
    const container = mainDiv?.children[0];

    //Содержит дату матча и четверти
    const headCount =
      container?.children[0]?.children[0]?.children[1]?.children[0];

    // Содержит четверти и счет
    const headResult = headCount?.children[3]?.children[2];

    const matchScoreDiff = headResult?.children[0]?.textContent
      .replace(REGEXP.removeSpaces, '')
      .split('-')
      .sort((a, b) => b - a)
      .reduce((a, b) => Number(a) - Number(b));

    // Четверти
    const quatres = headResult?.children[1]?.textContent
      .replace(REGEXP.removeBrackets, '')
      .split(', ');

    if (quatres?.length > 5) {
      continue;
    }

    const fourthQuarterSum =
      quatres && quatres[3].split('-').reduce((a, b) => Number(a) + Number(b));

    // дата матча
    const matchDateArr = headCount?.children[0]?.textContent
      .split(' | ')[0]
      .split(' ');

    const matchDate = makeMatchDateObj(matchDateArr, championship);

    //Таблицы
    const tablesDiv = container?.children[1]?.getElementsByClassName('nobg');

    if (!tablesDiv) {
      continue;
    }

    const matchResults = [];
    for (const tableDiv of tablesDiv) {
      const teamNameBeforeCheck = tableDiv?.children[0]?.textContent.trim(' ');
      const customNameFromData = teamNames?.find(el => {
        return (
          el.officialName.toLowerCase() === teamNameBeforeCheck.toLowerCase()
        );
      })?.customName;

      const teamName =
        customNameFromData !== undefined
          ? customNameFromData
          : teamNameBeforeCheck;

      const tableFooter = tableDiv?.children[1]?.tFoot?.rows[0]?.cells;
      const tableFooterNum = Array.from(tableFooter).map(el =>
        Number(el.textContent)
      );

      const cellE = tableFooterNum[4] + tableFooterNum[7];
      const cellF = tableFooterNum[5] + tableFooterNum[8];
      const cellG = tableFooterNum[10];
      const cellH = tableFooterNum[11];
      const cellI = tableFooterNum[16];
      const cellJ = tableFooterNum[17];
      const cellK = tableFooterNum[20];
      const cellL = tableFooterNum[23];
      const cellM = cellF + cellH + cellJ / 2 - cellK / 2 + cellJ;
      const cellN = cellE * 2 + cellG * 3 + cellI;
      const cellP = +(cellN / cellM).toFixed(2);
      const cellQ =
        quatres.length === 5
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
    }

    const result = {
      matchDate,
      matchResults,
    };

    leagueResult.push(result);
  }
  return leagueResult;
};

module.exports = handleHungChamp;
