const { Championship } = require('../../models/data');

const addData = async (req, res, next) => {
  const { championship, leagueName, url } = req.body;
  const { _id } = req.user;

  const isChampIn = await Championship.findOne({ championship, owner: _id });

  const leagueQuery = {
    championship,
    'league.leagueName': leagueName,
    owner: _id,
  };
  const isLeagueIn = await Championship.findOne(leagueQuery);

  // console.log('🚀 ~ isChampIn', isChampIn);
  // console.log('🚀 ~ test', isLeagueIn);

  if (!isChampIn) {
    const champ = await Championship.create({
      championship,
      league: [{ leagueName, url }],
      owner: _id,
    });
    console.log(champ.owner);
    res.status(201).json({
      championship: champ.championship,
      league: champ.league,
      owner: champ.owner,
    });
    return;
  }

  if (isChampIn && !isLeagueIn) {
    const newLeagueSet = { leagueName, url };
    await Championship.findOneAndUpdate(
      { championship, owner: _id },
      {
        $addToSet: { league: newLeagueSet },
      }
    );
  }
  // const leagueInDB = isChampIn.league.find(el => el.leagueName === leagueName);

  // // console.log('🚀 ~ leagueInDB', leagueInDB);

  // const checkData = () => {
  //   const dataAfterCheck = [...leagueInDB.url];
  //   url.forEach(element => {
  //     const filteredData = leagueInDB.url.filter(val => val === element);
  //     if (filteredData.length < 1) {
  //       dataAfterCheck.push(element);
  //     }
  //   });
  //   return dataAfterCheck;
  // };

  // const newSetOfUrl = checkData();
  // console.log('🚀 ~ newSetOfUrl', newSetOfUrl);

  // await Championship.findOneAndUpdate(
  //   { championship, owner: _id },
  //   { url: newSetOfUrl }
  // );

  res.status(201).send();
};

module.exports = addData;
