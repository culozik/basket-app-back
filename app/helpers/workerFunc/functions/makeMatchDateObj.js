const monthToNumber = require('./montToNumber');

const makeMatchDateObj = array => {
  const dateObj = {
    day: '',
    month: '',
    year: '',
  };
  array?.forEach((el, index) => {
    if (index === 0) {
      const val = Array.from(el.matchAll(/[0-9]/g)).slice(-2).join('');

      dateObj.year = val;
      return;
    }
    if (index === 1) {
      const val = monthToNumber(el);
      dateObj.month = val;
      return;
    }
    if (index === 2) {
      let val = Array.from(el.matchAll(/[0-9]/g)).join('');
      if (val.length === 1) {
        val = 0 + val;
      }
      dateObj.day = val;
      return;
    }
  });

  return dateObj;
};

module.exports = makeMatchDateObj;
