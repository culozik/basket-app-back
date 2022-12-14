const monthToNumber = require('./montToNumber');

const makeMatchDateObj = (data, championship) => {
  const dateObj = {
    day: '',
    month: '',
    year: '',
  };

  if (championship === 'hungary' || championship === 'japan') {
    data?.forEach((el, index) => {
      if (index === 0) {
        const val = el.slice(2, 4);
        dateObj.year = val;
        return;
      }
      if (index === 1) {
        const val = championship === 'hungary' ? monthToNumber(el) : el;
        dateObj.month = val;
        return;
      }
      if (index === 2) {
        let val = el?.slice(0, 2);
        if (val.length === 1) {
          val = 0 + val;
        }
        dateObj.day = val;
        return;
      }
    });
  } else if (championship === 'spain') {
    let i = 0;
    for (const key in dateObj) {
      if (i !== 2) {
        dateObj[key] = data[i];
      } else {
        dateObj[key] = data[i].slice(-2);
      }
      i += 1;
    }
  } else if (championship === 'latvia' || championship === 'serbia') {
    const day = data.getDate().toString();
    const month = (data.getMonth() + 1).toString();
    dateObj.day = day.length === 1 ? 0 + day : day;
    dateObj.month = month.length === 1 ? 0 + month : month;
    dateObj.year = data.getFullYear().toString().slice(-2);
  } else if (championship === 'turkey' || championship === 'brazil') {
    data?.forEach((el, index) => {
      if (index === 0) {
        dateObj.day = el?.length === 1 ? 0 + el : el;
        return;
      }
      if (index === 1 && championship === 'turkey') {
        const val = monthToNumber(el);
        dateObj.month = val;
        return;
      }
      if (index === 1 && championship === 'brazil') {
        const val = el?.length === 1 ? 0 + el : el;
        dateObj.month = val;
        return;
      }
      if (index === 2) {
        const val = el.slice(2, 4);
        dateObj.year = val;
        return;
      }
    });
  }

  return dateObj;
};

module.exports = makeMatchDateObj;
