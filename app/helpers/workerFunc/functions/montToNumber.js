const monthToNumber = month => {
  let monthNum = null;
  switch (month) {
    case 'január':
    case 'Ocak':
      monthNum = '01';
      break;
    case 'február':
    case 'Şubat':
      monthNum = '02';
      break;
    case 'március':
    case 'Mart':
      monthNum = '03';
      break;
    case 'április':
    case 'Nisan':
      monthNum = '04';
      break;
    case 'május':
    case 'Mayıs':
      monthNum = '05';
      break;
    case 'június':
    case 'Haziran':
      monthNum = '06';
      break;
    case 'július':
    case 'Temmuz':
      monthNum = '07';
      break;
    case 'augusztus':
    case 'Ağustos':
      monthNum = '08';
      break;
    case 'szeptember':
    case 'Eylül':
      monthNum = '09';
      break;
    case 'október':
    case 'Ekim':
      monthNum = '10';
      break;
    case 'november':
    case 'Kasım':
      monthNum = '11';
      break;
    case 'december':
    case 'Aralık':
      monthNum = '12';
      break;
    default:
      monthNum = '0';
      break;
  }
  return monthNum;
};

module.exports = monthToNumber;
