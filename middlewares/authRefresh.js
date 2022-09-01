// refresh.js
const { sign, verify, refreshVerifyDatabase } = require('../lib/jwt-util');
const { cookieStringToObject } = require('../lib/helpers');
const { accessTokenVerify, refreshTokenVerify } = require('../lib/refresh');
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
    return res.status(403).json({
      code: API_CODE.FAILURE_USER_AUTH,
      message: resMessage.FAILURE_USER_AUTH,
      result: null,
    });
  }
  //2. 엑세스 토큰이 없거나, 없는 경우
  if (
    !accessTokenVerifyInfo.ok &&
    (accessTokenVerifyInfo.reason === 'Access token is expired' ||
      accessTokenVerifyInfo.reason === 'Not have Access token')
  ) {
    console.log('Access token is Expired ');
    console.log('Refresh token 검증');
    const cookie = cookieStringToObject(req.headers.cookie);
    const refreshToken = cookie.refresh_token;
    console.log('cookie = ', cookie);
    console.log('refreshToken =', refreshToken);
    //1. refresh Token이 있는지
    //2. 복호화가 되는지
    const refreshTokenVerifyInfo = refreshTokenVerify(
      refreshToken,
      accessTokenVerifyInfo,
    );
    console.log('refreshTokenVerifyInfo =', refreshTokenVerifyInfo);
    // refreshTokenVerify가 안된다면
    if (!refreshTokenVerifyInfo.ok) {
      return res.status(403).json({
        code: API_CODE.FAILURE_USER_AUTH,
        message: resMessage.FAILURE_USER_AUTH,
        result: null,
      });
      //   return {
      //     ok: false,
      //     reason: 'retry login!',
      //   };
    }
    //3. db에 있고 검증되는지
    const refreshVerifyDatabaseInfo = await refreshVerifyDatabase(refreshToken);
    if (!refreshVerifyDatabaseInfo.ok) {
      return res.status(403).json({
        code: API_CODE.FAILURE_USER_AUTH,
        message: resMessage.FAILURE_USER_AUTH,
        result: null,
      });
    }
    console.log('refreshVerifyDatabaseInfo= ', refreshVerifyDatabaseInfo);
    const loginInfo = refreshVerifyDatabaseInfo.data[0].ID.split('_');
    const id = loginInfo[0];
    const email = loginInfo[1];
    // 데이터를 기반으로 accesstoken 발급
    const newAccessToken = sign({
      id,
      email,
    });

    res.cookie('access_token', newAccessToken, {
      maxAge: 1000,
      httpOnly: true,
    });

    /* 리프레시 토큰 기간 재 세팅 */
    res.cookie('refresh_token', refreshToken, {
      maxAge: 1000 * 60 * 60 * 24 * 1,
      httpOnly: true,
    });

    req.accessToken = newAccessToken;
    next();
  }

  if (
    accessTokenVerifyInfo.ok &&
    accessTokenVerifyInfo.reason === 'Access token is not expired' &&
    accessTokenVerifyInfo.decoded
  ) {
    console.log('accessTokenVerify is verify');
    req.decoded = accessTokenVerifyInfo.decoded;
    next();
  }
};

module.exports = authMiddleware;
