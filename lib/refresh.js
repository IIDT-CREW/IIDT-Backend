// refresh.js
const {
  sign,
  verify,
  refreshVerify,
  refreshVerifyDatabase,
} = require('./jwt-util');
const { cookieStringToObject } = require('./helpers');

const jwt = require('jsonwebtoken');
const { API_CODE } = require('./statusCode');
const resMessage = require('./resMessage');
const accessTokenVerify = (req) => {
  if (req?.headers?.authorization) {
    const accessToken = req.headers.authorization.split('Bearer ')[1];
    // access token 검증 -> expired여야 함.
    const authResult = verify(accessToken);
    // 디코딩 결과가 없으면 권한이 없음을 응답.
    if (authResult.decoded === null) {
      return {
        ok: false,
        reason: 'No authorized',
      };
    }

    if (authResult.ok === false && authResult.reason === 'jwt expired') {
      return {
        ok: false,
        reason: 'Access token is expired',
      };
    }
    if (authResult.ok === false) {
      return {
        ok: false,
        reason: 'No authorized',
      };
    }

    if (authResult.ok && authResult.decoded) {
      return {
        ok: true,
        decoded: authResult.decoded,
        reason: 'Access token is not expired',
      };
    }
  } else {
    // access token이 헤더에 없는 경우
    return {
      ok: false,
      reason: 'Not have Access token',
    };
  }
};

//1. 리프레시 토큰이 있는지
//2. 복호화가 되는지
const refreshTokenVerify = (refreshToken) => {
  if (refreshToken) {
    const refreshTokenVerified = verify(refreshToken);
    if (!refreshTokenVerified.ok)
      return {
        ok: false,
        reason: 'refresh token is not verify',
      };
    //검증 완료 되었으면
    if (refreshTokenVerified.ok)
      return {
        ok: true,
        reason: 'refresh token is verify',
      };

    if (
      refreshTokenVerified.ok === false &&
      refreshTokenVerified.reason === 'jwt expired'
    ) {
      return {
        ok: false,
        reason: 'refresh token is expired',
      };
    }
  } else {
    // refresh token이 헤더에 없는 경우
    return {
      ok: false,
      reason: 'Not have Refresh token',
    };
  }
};
//검증은 accesstoken으로 한다.
const authorization = async () => {
  //1. 액세스 토큰 검증
  const accessTokenVerifyInfo = accessTokenVerify(req);
  if (
    accessTokenVerifyInfo.ok &&
    accessTokenVerifyInfo.reason === 'Access token is not expired' &&
    accessTokenVerifyInfo.decoded
  ) {
    return {
      ok: true,
      decoded: accessTokenVerifyInfo.decoded,
      reason: 'Access token is not expired!',
    };
  }
  if (
    !accessTokenVerifyInfo.ok &&
    (accessTokenVerifyInfo.reason === 'Access token is expired' ||
      accessTokenVerifyInfo.reason === 'Not have Access token')
  ) {
    return {
      ok: false,
      reason: accessTokenVerifyInfo.reason,
    };
  }
};

const refresh = async (req, res) => {
  console.log('[refresh]');
  try {
    //1. 액세스 토큰 검증
    console.log('[refresh] 1. 액세스 토큰 검증');
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
      // console.log('[refresh] Access token is Expired ');
      // console.log('[refresh] Refresh token 검증');

      const cookie = cookieStringToObject(req.headers?.cookie);
      const refreshToken = cookie.refresh_token;

      //1. refresh Token이 있는지
      //2. 복호화가 되는지
      const refreshTokenVerifyInfo = refreshTokenVerify(
        refreshToken,
        accessTokenVerifyInfo,
      );
      console.log('[refresh] refreshTokenVerifyInfo =', refreshTokenVerifyInfo);
      // 만약 리프레시 토큰이 expired 됬다면
      if (
        !refreshTokenVerifyInfo.ok &&
        !refreshTokenVerifyInfo.reason === 'refresh token is expired'
      ) {
        if (!refreshTokenVerifyInfo.ok) {
          console.log('[refresh] 리프레시 토큰 익스파이어 ');
          return res.status(403).json({
            code: API_CODE.CREDENTIAL_EXPIRED,
            message: resMessage.CREDENTIAL_EXPIRED,
            result: null,
          });
        }
      }
      // refreshTokenVerify가 안된다면
      if (!refreshTokenVerifyInfo.ok) {
        console.log('[refresh] 리프레시 verify 검증 실패 ');
        return res.status(403).json({
          code: API_CODE.FAILURE_USER_AUTH,
          message: resMessage.FAILURE_USER_AUTH,
          result: null,
        });
      }

      //3. db에 있고 검증되는지
      const refreshVerifyDatabaseInfo = await refreshVerifyDatabase(
        refreshToken,
      );
      if (!refreshVerifyDatabaseInfo.ok) {
        console.log('[refresh] 리프레시 디비 검증 실패 ');
        return res.status(403).json({
          code: API_CODE.FAILURE_USER_AUTH,
          message: resMessage.FAILURE_USER_AUTH,
          result: null,
        });
      }
      console.log('[refresh] 리프레시 검증 완료 ');
      console.log(
        '[refresh] 리프레시 데이터 베이스 조회 ',
        refreshVerifyDatabaseInfo,
      );
      const loginInfo = refreshVerifyDatabaseInfo.data[0].ID.split('_');
      const id = loginInfo[0];
      const email = loginInfo[1];
      // 데이터를 기반으로 accesstoken 발급
      const newAccessToken = sign({
        id,
        email,
      });

      res.cookie('access_token', newAccessToken, {
        maxAge: 1000 * 60 * 60 * 4,
        httpOnly: true,
      });

      /* 리프레시 토큰 기간 재 세팅 */
      // 리프레시 토큰은 로그인 시에서만 발급하는걸로 정책 결정
      // res.cookie('refresh_token', refreshToken, {
      //   maxAge: 1000 * 60 * 60 * 24 * 20,
      //   httpOnly: true,
      // });

      console.log(
        '[refresh] 리프레시 검증 완료 및 엑세스 토큰 재발급 = ',
        newAccessToken,
      );
      return res.json({
        code: API_CODE.SUCCESS,
        reason: resMessage.SUCCESS,
        result: { accessToken: newAccessToken },
      });
    }

    if (
      accessTokenVerifyInfo.ok &&
      accessTokenVerifyInfo.reason === 'Access token is not expired' &&
      accessTokenVerifyInfo.decoded
    ) {
      console.log('[refresh] 엑세스 토큰 익스파이어 되지않음 ');
      return res.json({
        code: API_CODE.SUCCESS,
        reason: resMessage.SUCCESS,
        result: { accessToken },
      });
    }
  } catch (e) {
    console.log('e= ', e);
    return res.json({
      code: API_CODE.UNKNOWN_FAILURE_LOGIN,
      reason: resMessage.UNKNOWN_FAILURE_LOGIN,
      result: `${e.message}`,
    });
  }
};

module.exports = {
  refresh: refresh,
  accessTokenVerify: accessTokenVerify,
  refreshTokenVerify: refreshTokenVerify,
  authorization: authorization,
};
