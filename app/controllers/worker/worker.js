const handleUrlParser = require('../../helpers/workerFunc');

// Временная ссылка
// const baseLink = ['https://hunbasket.hu/merkozes/x2122/hun_2phu/hun_2phu_43'];
const moreThenFiveqt = [
  'https://hunbasket.hu/merkozes/x2122/hun_2phu/hun_2phu_43',
  'https://hunbasket.hu/merkozes/x2122/hun_2phu/hun_2phu_42',
  'https://hunbasket.hu/merkozes/x2122/hun_2phu/hun_2phu_45',
  'https://hunbasket.hu/merkozes/x2122/hun_2phu/hun_2phu_59',
  'https://hunbasket.hu/merkozes/x2122/hun/hun_1676',
  'https://hunbasket.hu/merkozes/x2122/hun/hun_1675',
  'https://hunbasket.hu/merkozes/x2122/hun2a_ply/hun2a_ply_165',
];

const analyzeData = async (req, res, next) => {
  const { country } = req.body;
  const result = await handleUrlParser(moreThenFiveqt);
  const { startTime, finishTime, parsedData } = result;

  const timeDuration = (finishTime - startTime) / 1000;

  const resultData = [
    {
      countryName: country,
      leagues: [
        {
          name: 'FÉRFI NB I. A CSOPORT',
          parsedData,
        },
      ],
    },
  ];

  res.status(200).json({ timeDuration, resultData });
};

module.exports = analyzeData;
