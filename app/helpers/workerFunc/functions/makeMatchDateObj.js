const monthToNumber = require('./montToNumber');

const makeMatchDateObj = (array, championship) => {
  const dateObj = {
    day: '',
    month: '',
    year: '',
  };
  if (championship === 'hungary') {
    array?.forEach((el, index) => {
      if (index === 0) {
        const val = el.slice(2, 4);
        dateObj.year = val;
        return;
      }
      if (index === 1) {
        const val = monthToNumber(el);
        dateObj.month = val;
        return;
      }
      if (index === 2) {
        let val = el.slice(0, 2);
        if (val.length === 1) {
          val = 0 + val;
        }
        dateObj.day = val;
        return;
      }
    });
  } else {
    let i = 0;
    for (const key in dateObj) {
      if (i !== 2) {
        dateObj[key] = array[i];
      } else {
        dateObj[key] = array[i].slice(-2);
      }
      i += 1;
    }
  }

  return dateObj;
};

module.exports = makeMatchDateObj;
