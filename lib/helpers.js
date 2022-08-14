let bcrypt = require('bcrypt-nodejs');

const STATUS_CODE = {
  200: 'success',
  404: 'data not found',
  999: 'etc',
};
const generateStatus = () => {
  return {
    message: '',
    data: '',
    status: '',
  };
};

const getBcryptSalt = () => {
  return new Promise((resolve, reject) => {
    bcrypt.genSalt(10, function (err, salt) {
      if (err) reject(err);
      resolve(salt);
    });
  });
};

const getHashedPassword = (password, bcySalt) => {
  return new Promise((resolve, reject) => {
    bcrypt.hash(password, bcySalt, null, function (err, hash) {
      if (err) {
        reject(err);
      }
      resolve(hash);
    });
  });
};
function makeReturnData(code, data) {
  return {
    result: code,
    message: STATUS_CODE[code],
    data: data,
  };
}

const bcryptCompare = (password, rows) => {
  return new Promise((resolve, reject) => {
    bcrypt.compare(password, rows[0].MEM_PASSWORD, (err, res) => {
      console.log(res);
      if (err) {
        reject(err);
      } else if (res) {
        //성공시
        console.log('bcryptCheck , res', res);
        payload = {
          mem_email: rows[0].MEM_EMAIL,
          gb_cd: rows[0].MEM_GB_CD,
          mem_avater_path: rows[0].MEM_AVATER_PATH,
          mem_user_name: rows[0].MEM_USER_NAME,
        };
        resolve(token.generateToken(payload));
      } else {
        reject();
      }
    });
  });
};

module.exports = {
  generateStatus: generateStatus,
  getBcryptSalt: getBcryptSalt,
  getHashedPassword: getHashedPassword,
  bcryptCompare: bcryptCompare,
  makeReturnData: makeReturnData,
};
