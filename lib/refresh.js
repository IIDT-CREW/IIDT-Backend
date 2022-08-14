// refresh.js
const { sign, verify, refreshVerify } = require('./jwt-util');
const jwt = require('jsonwebtoken');

const authorizationRequest = async (req) => {
  console.log('authorizationRequest  ', req.headers);
  // access token과 refresh token의 존재 유무를 체크합니다.
  if (req.headers.authorization && req.headers.refresh) {
    const authToken = req.headers.authorization.split('Bearer ')[1];
    const refreshToken = req.headers.refresh;

    // access token 검증 -> expired여야 함.
    const authResult = verify(authToken);
    // access token 디코딩하여 user의 정보를 가져옵니다.
    const decoded = jwt.decode(authToken);

    // 디코딩 결과가 없으면 권한이 없음을 응답.
    if (decoded === null) {
      return {
        ok: false,
        reason: 'No authorized!',
      };
    }
    /* access token의 decoding 된 값에서
      유저의 id를 가져와 refresh token을 검증합니다. */
    const refreshResult = refreshVerify(refreshToken, decoded.id);
    // 재발급을 위해서는 access token이 만료되어 있어야합니다.
    if (authResult.ok === false && authResult.reason === 'jwt expired') {
      // 1. access token이 만료되고, refresh token도 만료 된 경우 => 새로 로그인해야합니다.
      if (refreshResult.ok === false) {
        return {
          ok: false,
          reason: 'No authorized!',
        };
      } else {
        // 2. access token이 만료되고, refresh token은 만료되지 않은 경우 => 새로운 access token을 발급
        const newAccessToken = sign(user);
        return {
          // 새로 발급한 access token과 원래 있던 refresh token 모두 클라이언트에게 반환합니다.
          ok: true,
          data: {
            decoded: decoded,
            accessToken: newAccessToken,
            refreshToken,
          },
        };
      }
    } else {
      // 3. access token이 만료되지 않은경우 => refresh 할 필요가 없습니다.
      return {
        ok: true,
        decoded: decoded,
        reason: 'Access token is not expired!',
      };
    }
  } else {
    // access token 또는 refresh token이 헤더에 없는 경우
    return {
      ok: false,
      reason: 'Access token and refresh token are need for refresh!',
    };
  }
};

const refreshClinetSide = async (req, res) => {
  console.log('inside refreshClinetSide');
  const cookie = cookieStringToObject(req.headers.cookie);
  console.log('cookie: ' + cookie.access_token);
  if (cookie.access_token && cookie.refresh_token) {
    console.log('검증시작');
    const authToken = cookie.access_token;
    const refreshToken = cookie.refresh_token;

    // access token 검증 -> expired여야 함.
    const authResult = verify(authToken);

    // access token 디코딩하여 user의 정보를 가져옵니다.
    const decoded = jwt.decode(authToken);
    console.log('authResult = ', authResult, 'decoded = ', decoded);
    // 디코딩 결과가 없으면 권한이 없음을 응답.
    if (decoded === null) {
      res.status(401).send({
        ok: false,
        reason: 'No authorized!',
      });
    }
    /* access token의 decoding 된 값에서
      유저의 id를 가져와 refresh token을 검증합니다. */
    const refreshResult = await refreshVerify(refreshToken, decoded.email);

    console.log('리프레시 토큰 검증 ', refreshResult);
    // 재발급을 위해서는 access token이 만료되어 있어야합니다.
    if (authResult.ok === false && authResult.reason === 'jwt expired') {
      // 1. access token이 만료되고, refresh token도 만료 된 경우 => 새로 로그인해야합니다.
      if (refreshResult.ok === false) {
        res.status(401).send({
          ok: false,
          reason: 'No authorized!',
        });
      } else {
        // 2. access token이 만료되고, refresh token은 만료되지 않은 경우 => 새로운 access token을 발급
        const newAccessToken = sign(user);

        res.status(200).send({
          // 새로 발급한 access token과 원래 있던 refresh token 모두 클라이언트에게 반환합니다.
          ok: true,
          data: {
            accessToken: newAccessToken,
            refreshToken,
          },
        });
      }
    } else {
      // 3. access token이 만료되지 않은경우 => refresh 할 필요가 없습니다.
      res.status(400).send({
        ok: false,
        reason: 'Acess token is not expired!',
      });
    }
  } else {
    // access token 또는 refresh token이 헤더에 없는 경우
    res.status(400).send({
      ok: false,
      reason: 'Access token and refresh token are need for refresh!',
    });
  }
};

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

/* 클라이언트 사이드에서 httpOnly 쿠키값을 읽어서 bearer 세팅을 하지못해 다른 방식으로 접근필요 */
const refresh = async (req, res) => {
  console.log('inside refresh');
  if (req.headers.authorization && req.headers.refresh) {
    const authToken = req.headers.authorization.split('Bearer ')[1];
    const refreshToken = req.headers.refresh;

    // access token 검증 -> expired여야 함.
    const authResult = verify(authToken);

    // access token 디코딩하여 user의 정보를 가져옵니다.
    const decoded = jwt.decode(authToken);
    console.log('authResult = ', authResult, 'decoded = ', decoded);
    // 디코딩 결과가 없으면 권한이 없음을 응답.
    if (decoded === null) {
      res.status(401).send({
        ok: false,
        reason: 'No authorized!',
      });
    }
    /* access token의 decoding 된 값에서
      유저의 id를 가져와 refresh token을 검증합니다. */
    const refreshResult = refreshVerify(refreshToken, decoded.id);
    // 재발급을 위해서는 access token이 만료되어 있어야합니다.
    if (authResult.ok === false && authResult.reason === 'jwt expired') {
      // 1. access token이 만료되고, refresh token도 만료 된 경우 => 새로 로그인해야합니다.
      if (refreshResult.ok === false) {
        res.status(401).send({
          ok: false,
          reason: 'No authorized!',
        });
      } else {
        // 2. access token이 만료되고, refresh token은 만료되지 않은 경우 => 새로운 access token을 발급
        const newAccessToken = sign(user);

        res.status(200).send({
          // 새로 발급한 access token과 원래 있던 refresh token 모두 클라이언트에게 반환합니다.
          ok: true,
          data: {
            accessToken: newAccessToken,
            refreshToken,
          },
        });
      }
    } else {
      // 3. access token이 만료되지 않은경우 => refresh 할 필요가 없습니다.
      res.status(400).send({
        ok: false,
        reason: 'Acess token is not expired!',
      });
    }
  } else {
    // access token 또는 refresh token이 헤더에 없는 경우
    res.status(400).send({
      ok: false,
      reason: 'Access token and refresh token are need for refresh!',
    });
  }
};

module.exports = {
  refresh: refresh,
  refreshClinetSide: refreshClinetSide,
  authorizationRequest: authorizationRequest,
};
