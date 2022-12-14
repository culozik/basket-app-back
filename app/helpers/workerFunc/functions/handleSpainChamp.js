const jsdom = require('jsdom');
const { JSDOM } = jsdom;

const makeMatchDateObj = require('./makeMatchDateObj');
const handleTeamName = require('./handleTeamName.js');

const LINK = 'https://baloncestoenvivo';

const handleSpainChamp = async (url, teamNames, championship, league) => {
  const leagueResult = [];
  const quarterSumCheck = league?.includes('(W)') ? 40 : 45;

  for (const address of url) {
    const matchResultsWithoutNames = [];
    if (!address.startsWith(LINK)) continue;

    try {
      const currentPage = await JSDOM.fromURL(address);
      const dom = currentPage.window.document;
      const headCount = dom
        ?.getElementsByClassName('box-marcador tableLayout de tres columnas')
        ?.item(0);

      const matchScoreDiv = headCount?.children
        ?.item(0)
        ?.getElementsByClassName('resultado');

      const matchScoreDiff = Array.from(matchScoreDiv)
        ?.sort((a, b) => b?.textContent - a?.textContent)
        ?.reduce(
          (a, b) =>
            Number.parseInt(a?.textContent) - Number.parseInt(b?.textContent)
        );

      const quatres = dom
        .getElementsByClassName('box-cuartos')
        ?.item(0)?.children;

      if (quatres?.length > 5) {
        continue;
      }

      const re = /\//;
      const quartersArr = dom
        ?.getElementsByClassName('box-cuartos')
        ?.item(0)
        ?.textContent?.trim()
        ?.split(' ')
        ?.filter(quarter => quarter?.length > 3)
        ?.map(item => item?.trim()?.slice(1)?.replace(re, '-'))
        ?.filter(quarter => quarter !== 'ro.');

      const fourthQuarterSum =
        quatres &&
        quatres[3]?.children[1]?.textContent
          ?.split('/')
          ?.reduce((a, b) => Number.parseInt(a) + Number.parseInt(b));

      const matchDateArr = dom
        .getElementsByClassName('box-datos-partido')
        ?.item(0)
        ?.children[0]?.lastElementChild?.textContent?.split(' - ')[0]
        ?.split('/');
      const matchDate = makeMatchDateObj(matchDateArr, championship);

      const teamNamesArrayDom = dom.getElementsByClassName('titulo-modulo');
      const tablesDivArr = dom.getElementsByClassName('responsive-scroll');

      const teamNamesArray = Array.from(teamNamesArrayDom)?.map(name => {
        const teamNameBeforeCheck = name?.textContent?.trim();
        const teamName = handleTeamName(teamNames, teamNameBeforeCheck);
        return teamName;
      });

      for (const tableDiv of tablesDivArr) {
        const tableFooter =
          tableDiv?.children[0]?.getElementsByClassName('row-total')[0];

        const cellE = Number(
          tableFooter?.children[5]?.firstChild?.textContent
            ?.trim()
            ?.split('/')[0]
        );
        const cellF = Number(
          tableFooter?.children[5]?.firstChild?.textContent
            ?.trim()
            ?.split('/')[1]
        );
        const cellG = Number(
          tableFooter?.children[6]?.firstChild?.textContent
            ?.trim()
            ?.split('/')[0]
        );
        const cellH = Number(
          tableFooter?.children[6]?.firstChild?.textContent
            ?.trim()
            ?.split('/')[1]
        );
        const cellI = Number(
          tableFooter?.children[8]?.firstChild?.textContent
            ?.trim()
            ?.split('/')[0]
        );
        const cellJ = Number(
          tableFooter?.children[8]?.firstChild?.textContent
            ?.trim()
            ?.split('/')[1]
        );
        const cellK = Number(
          tableFooter?.children[9]?.firstChild?.textContent
            ?.trim()
            ?.split('/')[0]
        );
        const cellL = Number(
          tableFooter?.children[14]?.firstChild?.textContent
            ?.trim()
            ?.split('/')[0]
        );
        const cellM = cellF + cellH + cellJ / 2 - cellK / 2 + cellL;
        const cellN = cellE * 2 + cellG * 3 + cellI;
        const cellP = +(cellN / cellM).toFixed(2);
        const cellQ =
          quatres.length === 5
            ? 'OT'
            : (matchScoreDiff <= 10) & (fourthQuarterSum > quarterSumCheck)
            ? 'FS'
            : '';

        const tableData = {
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
        matchResultsWithoutNames.push(tableData);
      }

      const matchResultWithNames = matchResultsWithoutNames.map(
        ({ results }, index) => {
          return {
            teamName: teamNamesArray[index],
            results,
          };
        }
      );

      const result = {
        matchDate,
        quarters: quartersArr,
        matchResults: matchResultWithNames,
      };

      leagueResult.push(result);
    } catch (error) {
      console.log(error);
    }
  }
  return leagueResult;
};

module.exports = handleSpainChamp;
