const axios = require('axios');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;

const makeMatchDateObj = require('./makeMatchDateObj');

const handleSpainChamp = async (url, teamNames, championship) => {
  for (const address of url) {
    const response = await axios.get(address);

    const currentPage = response.data;
    const dom = new JSDOM(currentPage).window.document;

    //Получение div с четвертями и счетом
    const headCount = dom
      .getElementsByClassName('box-marcador tableLayout de tres columnas')
      .item(0);
    // Содержит четверти и счет
    const matchScoreDiv = headCount.children
      .item(0)
      .getElementsByClassName('resultado');

    const matchScoreDiff = Array.from(matchScoreDiv)
      .sort((a, b) => b.textContent - a.textContent)
      .reduce((a, b) => Number(a.textContent) - Number(b.textContent));
    console.log('🚀 ~ matchScoreDiff', matchScoreDiff);

    const quatres = dom.getElementsByClassName('box-cuartos').item(0)?.children;

    if (quatres?.length > 5) {
      continue;
    }

    const fourthQuarterSum =
      quatres &&
      quatres[3]?.children[1]?.textContent
        .split('/')
        .reduce((a, b) => Number(a) + Number(b));
    console.log('🚀 ~ fourthQuarterSum', fourthQuarterSum);

    // Дата
    const matchDateArr = dom
      .getElementsByClassName('box-datos-partido')
      ?.item(0)
      .children[0].lastElementChild.textContent.split(' - ')[0]
      ?.split('/');
    const matchDate = makeMatchDateObj(matchDateArr, championship);
    console.log('🚀 ~ matchDate', matchDate);

    //   Названия команд и статистика
    const teamNamesArrayDom = dom.getElementsByClassName('titulo-modulo');
    const tablesDivArr = dom.getElementsByClassName('responsive-scroll');
    console.log('🚀 ~ tablesDivArr', tablesDivArr);

    const teamNamesArray = Array.from(teamNamesArrayDom).map(name => {
      const teamNameBeforeCheck = name.textContent.trim();
      const customNameFromData = teamNames?.find(el => {
        return (
          el.officialName.toLowerCase() === teamNameBeforeCheck.toLowerCase()
        );
      })?.customName;
      const teamName =
        customNameFromData !== undefined
          ? customNameFromData
          : teamNameBeforeCheck;
      return teamName;
    });
    console.log('🚀 ~ teamNamesArray', teamNamesArray);
  }
};

module.exports = handleSpainChamp;
