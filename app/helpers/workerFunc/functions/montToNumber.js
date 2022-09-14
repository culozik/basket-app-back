const monthToNumber = month => {
  let monthNum = null;
  switch (month) {
    case 'január':
      monthNum = '01';
      break;
    case 'február':
      monthNum = '02';
      break;
    case 'március':
      monthNum = '03';
      break;
    case 'április':
      monthNum = '04';
      break;
    case 'május':
      monthNum = '05';
      break;
    case 'június':
      monthNum = '06';
      break;
    case 'július':
      monthNum = '07';
      break;
    case 'augusztus':
      monthNum = '08';
      break;
    case 'szeptember':
      monthNum = '09';
      break;
    case 'október':
      monthNum = '10';
      break;
    case 'november':
      monthNum = '11';
      break;
    case 'december':
      monthNum = '12';
      break;
    default:
      monthNum = '0';
      break;
  }
  return monthNum;
};

module.exports = monthToNumber;
