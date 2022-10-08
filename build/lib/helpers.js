let bcrypt = require('bcrypt-nodejs');

const {
  API_CODE
} = require('./statusCode');

const resMessage = require('./resMessage');

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

const bcryptCompare = (password, rows) => {
  return new Promise((resolve, reject) => {
    bcrypt.compare(password, rows[0].MEM_PASSWORD, (err, res) => {
      //console.log(res);
      if (err) {
        reject(err);
      } else if (res) {
        //성공시
        //console.log('bcryptCheck , res', res);
        payload = {
          mem_email: rows[0].MEM_EMAIL,
          gb_cd: rows[0].MEM_GB_CD,
          mem_avater_path: rows[0].MEM_AVATER_PATH,
          mem_user_name: rows[0].MEM_USER_NAME
        };
        resolve(token.generateToken(payload));
      } else {
        reject();
      }
    });
  });
};

function returnResponse(code, resMessage, data) {
  const responseData = {
    code: code,
    reason: resMessage,
    result: data
  };
  return responseData;
} //* "token=value" 를 {token:"value"}로 바꾸는 함수


const cookieStringToObject = cookieString => {
  const cookies = {};

  if (cookieString) {
    //* "token=value"
    const itemString = cookieString?.split(/\s*;\s*/);
    itemString.forEach(pairs => {
      //* ["token","value"]
      const pair = pairs.split(/\s*=\s*/);
      cookies[pair[0]] = pair.splice(1).join('=');
    });
  }

  return cookies;
};

module.exports = {
  returnResponse: returnResponse,
  getBcryptSalt: getBcryptSalt,
  getHashedPassword: getHashedPassword,
  bcryptCompare: bcryptCompare,
  cookieStringToObject
};