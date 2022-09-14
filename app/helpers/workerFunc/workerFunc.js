const axios = require('axios');
// const fs = require('fs/promises');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;

const { makeMatchDateObj } = require('./functions');

const REGEXP = {
  removeBrackets: /[()]/g,
  removeSpaces: /\s+/g,
};

const handleUrlParser = async dataToPrase => {
  const startTime = Date.now();

  const parsedData = [];

  for (const url of dataToPrase) {
    const response = await axios.get(url);

    const currentPage = response.data;
    const dom = new JSDOM(currentPage);

    //   Получение content Div
    const mainDiv = dom.window.document.getElementById('boxscore_top');
    const container = mainDiv.children[0];

    //Содержит дату матча и четверти
    const headCount = container.children[0].children[0].children[1].children[0];

    // Содержит четверти и счет
    const headResult = headCount.children[3].children[2];

    const matchScoreDiff = headResult.children[0].textContent
      .replace(REGEXP.removeSpaces, '')
      .split('-')
      .sort((a, b) => b - a)
      .reduce((a, b) => Number(a) - Number(b));

    // Четверти
    const quatres = headResult.children[1].textContent
      .replace(REGEXP.removeBrackets, '')
      .split(', ');

    if (quatres.length > 5) {
      continue;
    }

    const fourthQuarterSum = quatres[3]
      .split('-')
      .reduce((a, b) => Number(a) + Number(b));

    // дата матча
    const matchDateArr = headCount.children[0].textContent
      .split(' | ')[0]
      .split(' ');

    const matchDate = makeMatchDateObj(matchDateArr);

    //Таблицы
    const tablesDiv = container.children[1].getElementsByClassName('nobg');

    const matchResults = [];
    for (const tableDiv of tablesDiv) {
      const teamName = tableDiv.children[0].textContent.trim(' ');
      const tableFooter = tableDiv.children[1].tFoot.rows[0].cells;
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
      // const cellQ = (matchScoreDiff < 10) & (fourthQuarterSum > 45) ? 'FS' : '';

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

    // Первая таблица

    // Данные с футера первой таблици
    //   const elFive = Number(firstTable.tFoot.rows[0].cells[4].innerHTML);
    //   const elSix = Number(firstTable.tFoot.rows[0].cells[5].innerHTML);

    //   const returnData = elFive + elSix;

    //   console.log('returnData', returnData);

    const result = {
      matchDate,
      matchResults,
    };

    // console.log('matchDate: ', matchDate);
    // console.log('matchScoreDiff: ', matchScoreDiff);
    // console.log('quatres: ', quatres);
    // console.log('fourthQuarterSum: ', fourthQuarterSum);

    parsedData.push(result);
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
