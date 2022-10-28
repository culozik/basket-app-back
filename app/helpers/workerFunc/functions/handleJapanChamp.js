const axios = require('axios');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;

const makeMatchDateObj = require('./makeMatchDateObj');
const handleTeamName = require('./handleTeamName.js');

const LINK = 'https://www.b3league.jp/';

const handleJapanChamp = async (url, teamNames, championship) => {
  const leagueResult = [];

  const getJapanTeamQuarters = (data, index) => {
    return Array.from(data[index].cells)
      ?.filter(item => Number.parseInt(item.textContent))
      ?.map(item => Number.parseInt(item.textContent));
  };

  const getTableRow = (data, index) => {
    if (index === 0) {
      return Array.from(data[index]?.cells)?.map(item => item?.textContent);
    }
    return Array.from(data[data?.length - index]?.cells)?.map(item =>
      Number.parseInt(item?.textContent)
    );
  };

  const getCellValue = (query, headerRow, lastRow, penultimateRow = []) => {
    const indx = headerRow?.findIndex(val => val === query);

    if (query === 'OREB' || query === 'TOV') {
      const celValue = lastRow[indx] - penultimateRow[indx];
      return celValue;
    }

    const celValue = lastRow[indx];
    return celValue;
  };

  for (const address of url) {
    const matchResults = [];
    if (!address.startsWith(LINK)) continue;

    const response = await axios.get(address);

    const currentPage = response.data;
    const dom = new JSDOM(currentPage);

    const mainDiv = dom.window.document.getElementsByClassName('main');

    if (!mainDiv) {
      continue;
    }
    const headCount = dom.window.document.getElementsByClassName('caption');

    const matchScoreDiff = Array.from(headCount)
      ?.map(item => Number(item?.textContent?.trim('\n')))
      ?.sort((a, b) => b - a)
      ?.reduce((a, b) => Number.parseInt(a) - Number.parseInt(b));

    const quartersDiv =
      dom.window.document.getElementsByClassName('col-md-12')[0]?.children[0]
        ?.children[0]?.rows;

    const homeTeamQuarters = getJapanTeamQuarters(quartersDiv, 1);
    const awayTeamQuarters = getJapanTeamQuarters(quartersDiv, 2);

    const quartersArr = [];
    for (let i = 0; i < homeTeamQuarters?.length; i += 1) {
      const quarterArr = `${homeTeamQuarters[i]}-${awayTeamQuarters[i]}`;
      quartersArr.push(quarterArr);
    }

    if (quartersArr?.length > 5) continue;

    const fourthQuarterSum = homeTeamQuarters[3] + awayTeamQuarters[3];

    const dateDiv = mainDiv?.item(0)?.children[9]?.textContent;
    const matchDateArr = dateDiv
      ?.split(' ')[0]
      ?.split(/\D/)
      ?.filter(item => item?.length > 0);
    const matchDate = makeMatchDateObj(matchDateArr, championship);

    const matchResultTablesDiv = dom.window.document.getElementById('allb');

    if (!matchResultTablesDiv) {
      continue;
    }

    const tablesDiv = matchResultTablesDiv?.querySelectorAll('div');
    const teamNamesDiv = matchResultTablesDiv?.querySelectorAll('h2');

    const teamNamesArray = Array.from(teamNamesDiv)?.map(name => {
      const teamNameBeforeCheck = name?.textContent?.trim();
      const teamName = handleTeamName(teamNames, teamNameBeforeCheck);
      return teamName;
    });

    tablesDiv?.forEach((tableDiv, index) => {
      const tableHeader = tableDiv?.children[0]?.tHead?.rows;
      const tableFooter = tableDiv?.children[0]?.tBodies;
      const tableLastRows = tableFooter?.item(0)?.rows;

      const tableHeaderRow = getTableRow(tableHeader, 0);
      const tablePenultimateRow = getTableRow(tableLastRows, 2);
      const tableFooterArr = getTableRow(tableLastRows, 1);

      const cellE = getCellValue('2PM', tableHeaderRow, tableFooterArr);
      const cellF = getCellValue('2PA', tableHeaderRow, tableFooterArr);
      const cellG = getCellValue('3PM', tableHeaderRow, tableFooterArr);
      const cellH = getCellValue('3PA', tableHeaderRow, tableFooterArr);
      const cellI = getCellValue('FTM', tableHeaderRow, tableFooterArr);
      const cellJ = getCellValue('FTA', tableHeaderRow, tableFooterArr);
      const cellK = getCellValue(
        'OREB',
        tableHeaderRow,
        tableFooterArr,
        tablePenultimateRow
      );
      const cellL = getCellValue(
        'TOV',
        tableHeaderRow,
        tableFooterArr,
        tablePenultimateRow
      );
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
        teamName: teamNamesArray[index],
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
  }
  return leagueResult;
};

module.exports = handleJapanChamp;
