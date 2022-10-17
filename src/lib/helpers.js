let bcrypt = require('bcrypt-nodejs');
const { API_CODE } = require('./statusCode');
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
          mem_user_name: rows[0].MEM_USER_NAME,
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
    result: data,
  };
  return responseData;
}

//* "token=value" 를 {token:"value"}로 바꾸는 함수
const cookieStringToObject = (cookieString) => {
  const cookies = {};
  if (cookieString) {
    //* "token=value"
    const itemString = cookieString?.split(/\s*;\s*/);
    itemString.forEach((pairs) => {
      //* ["token","value"]
      const pair = pairs.split(/\s*=\s*/);
      cookies[pair[0]] = pair.splice(1).join('=');
    });
  }
  return cookies;
};

getPaginatedItems = (items, pageNo, pageSize) => {
  //pageNo = 1 , pageSize = 5
  // => 5( 1 - 1 ) * 5 , 1 * 5
  // =>  0 , 5
  //pageNo = 2 , pageSize = 5
  // => ( 2 -1 ) * 5  , 2 * 5
  // => 5 , 10
  return items.slice((pageNo - 1) * pageSize, pageNo * pageSize);
};

const PAGE_SIZE = 5;
//page는 1부터 시작한다;
const makePaginate = (req, result) => {
  let pageNo = parseInt(req.query.pageNo, 10);
  let pageSize = req.query.pageSize
    ? parseInt(req.query.pageSize, 10)
    : PAGE_SIZE;
  let totalCount = result.length;
  let totalPageCount = Math.ceil(result.length / pageSize) + 1;
  let nextPageNo = pageNo + 1 < totalPageCount ? pageNo + 1 : totalPageCount;
  let isLast = nextPageNo === totalPageCount;

  let meta = {
    pageNo: pageNo,
    pageSize: pageSize,
    totalCount: totalCount,
    totalPageCount: totalPageCount,
    nextPageNo: nextPageNo,
    isLast: isLast,
  };

  const paginatedPosts = getPaginatedItems(
    result,
    pageNo ? pageNo : 1,
    pageSize,
  );

  const json = {
    meta: meta,
    postsList: paginatedPosts,
  };

  return json;
};

module.exports = {
  returnResponse: returnResponse,
  getBcryptSalt: getBcryptSalt,
  getHashedPassword: getHashedPassword,
  bcryptCompare: bcryptCompare,
  cookieStringToObject,
  makePaginate,
};
