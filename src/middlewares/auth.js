const { accessTokenVerify } = require('../lib/refresh');
const { API_CODE } = require('../lib/statusCode');
const resMessage = require('../lib/resMessage');

const authMiddleware = async (req, res, next) => {
  //1. 액세스 토큰 검증
  const accessTokenVerifyInfo = accessTokenVerify(req);
  console.log('accessTokenVerifyInfo =', accessTokenVerifyInfo);
  if (
    !accessTokenVerifyInfo.ok &&
    accessTokenVerifyInfo.reason === 'No authorized'
  ) {
    return res.json({
      code: API_CODE.FAILURE_USER_AUTH,
      message: resMessage.FAILURE_USER_AUTH,
      result: resMessage.FAILURE_USER_AUTH,
    });
  }
  //2. 엑세스 토큰이 익스파이어 됬거나 없는 경우
  if (
    !accessTokenVerifyInfo.ok &&
    (accessTokenVerifyInfo.reason === 'Access token is expired' ||
      accessTokenVerifyInfo.reason === 'Not have Access token')
  ) {
    console.log('2. 엑세스 토큰이 익스파이어 됬거나 없는 경우');
    return res.json({
      code: API_CODE.CREDENTIAL_EXPIRED,
      message: resMessage.CREDENTIAL_EXPIRED,
      result: resMessage.FAILURE_USER_AUTH,
    });
  }

  if (
    accessTokenVerifyInfo.ok &&
    accessTokenVerifyInfo.reason === 'Access token is not expired'
  ) {
    console.log('accessTokenVerify is verify');
    req.decoded = accessTokenVerifyInfo.decoded;
    next();
  }
};

module.exports = authMiddleware;
