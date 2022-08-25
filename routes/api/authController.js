let express = require('express');
let router = express.Router();
const jwt = require('../../lib/jwt-util');
// const redisClient = require('../../lib/redis');
const {
  refresh,
  // refreshClinetSide,
  authorizationRequest,
} = require('../../lib/refresh');
const _ = require('lodash');
const authMiddleware = require('../../middlewares/auth');
const helper = require('../../lib/helpers');
const winston = require('winston');
const logger = winston.createLogger();
const qs = require('qs');
const fetch = require('node-fetch');
const authDaoNew = require('../../model/mysql/authDaoNew');
const authJwt = require('../../middlewares/auth');
const resMessage = require('../../lib/resMessage');
const statusCode = require('../../lib/statusCode');
const { API_CODE } = require('../../lib/statusCode');

class Kakao {
  constructor(code) {
    this.url = 'https://kauth.kakao.com/oauth/token';
    this.clientID = process.env.KAKAO_CLIENT_ID;
    this.clientSecret = process.env.KAKAO_CLIENT_SECRET;
    this.redirectUri = 'http://localhost:3001/oauth/callback/kakao';
    this.code = code;
    // userInfo
    this.userInfoUrl = 'https://kapi.kakao.com/v2/user/me';
    this.userInfoMethod = 'post';
  }
}

class Google {
  constructor(code) {
    this.url = 'https://oauth2.googleapis.com/token';
    this.clientID = process.env.GOOGLE_CLIENT_ID;
    this.clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    this.redirectUri = 'http://localhost:3001/oauth/callback/google';
    this.grant_type = 'authorization_code';
    this.code = code;
    // userInfo
    this.userInfoUrl = '';
    this.userInfoMethod = 'get';
  }
}

class Naver {
  constructor(code, state) {
    this.url = 'https://nid.naver.com/oauth2.0/token';
    this.clientID = process.env.NAVER_CLIENT_ID;
    this.clientSecret = process.env.NAVER_SECRET;
    this.redirectUri = 'http://localhost:3001/oauth/callback/naver';
    this.grant_type = 'authorization_code';
    this.code = code;
    this.state = state;
    // userInfo
    this.userInfoUrl = 'https://openapi.naver.com/v1/nid/me';
    this.userInfoMethod = 'get';
  }
}

bcryptCheck = async (password, rows) => {
  try {
    const jwtToken = await helper.bcryptCompare(password, rows);
    return jwtToken;
  } catch (e) {
    console.error(e);
  }
};

const getAccessToken = async (options) => {
  try {
    return await fetch(options.url, {
      method: 'POST',
      headers: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
      },
      body: qs.stringify({
        grant_type: 'authorization_code', //특정 스트링
        client_id: options.clientID,
        client_secret: options.clientSecret,
        redirectUri: options.redirectUri,
        redirect_uri: options.redirectUri,
        code: options.code,
        state: options?.state,
      }),
    }).then((res) => res.json());
  } catch (e) {
    logger.info('error', e);
  }
};

//

// authorization: `token ${accessToken}`,
// accept: 'application/json'
const getUserInfo = async (method, url, access_token) => {
  try {
    return await fetch(url, {
      method: method,
      headers: {
        'Content-type': 'application/x-www-form-urlencoded;charset=utf-8',
        Authorization: `Bearer ${access_token}`,
      },
    }).then((res) => {
      console.log(res);
      return res.json();
    });
  } catch (e) {
    logger.info('error', e);
  }
};

async function signUp({ id, email, nickname, social, isExist }) {
  let jwtToken = null;
  let refreshToken = null;
  if (!isExist) {
    console.log('[signUp] 가입되지 않은 회원입니다.');
    //회원 가입후 토큰 발급
    const userData = {
      mem_username: '',
      mem_userid: id,
      mem_email: email,
      mem_social: social,
      mem_nickname: nickname,
    };
    const signUpResponse = await authDaoNew.setMemberSignUp(userData);

    if (!signUpResponse) return 'error';
    if (signUpResponse) {
      jwtToken = jwt.sign({
        id: id,
        email: email,
      });
      refreshToken = jwt.refresh();
    }
  } else {
    console.log('[signUp] 가입된  회원입니다.');
    jwtToken = jwt.sign({
      id: id,
      email: email,
    });
    refreshToken = jwt.refresh();
  }
  console.log('[signUp] accessToken =', jwtToken);
  console.log('[signUp] refreshToken =', refreshToken);
  return { jwtToken, refreshToken };
}

// function returnResponse({ res, jwtToken, refreshToken }) {
//   res.cookie('access_token', jwtToken, {
//     maxAge: 60 * 1000,
//     expires: false,
//     httpOnly: true,
//   });

//   res.cookie('refresh_token', refreshToken, {
//     maxAge: 1000 * 60 * 60 * 24 * 1,
//     httpOnly: true,
//   });

//   let responseData = {
//     code: statusCode.OK,
//     reason: resMessage.SIGN_IN_SUCCESS,
//     accessToken: jwtToken,
//   };
//   console.log('responseData = ', responseData);
//   return responseData;
// }

function returnResponse({ res, jwtToken, refreshToken }) {
  // res.cookie('access_token', jwtToken, {
  //   maxAge: 60 * 1000,
  //   expires: false,
  //   httpOnly: true,
  // });

  // res.cookie('refresh_token', refreshToken, {
  //   maxAge: 1000 * 60 * 60 * 24 * 1,
  //   httpOnly: true,
  // });

  let responseData = {
    code: API_CODE.SUCCESS,
    reason: resMessage.SUCCESS,
    result: '',
    accessToken: jwtToken,
    refreshToken,
  };

  //console.log('responseData = ', responseData);
  return responseData;
}
/* 소셜 로그인시 
 1. 소셜 로그인시 가입이 되어있는지 확인
 1-1. 가입이 되어있다면 가입 이메일로 로그인
 1-2. 가입이 안되어있다면 가입시켜주고 로그인 시켜주기  
*/
router.get('/callback/:coperation', async (req, res) => {
  try {
    let coperation = req.params.coperation;
    let authorization_code = req.query.code;
    let options;
    switch (coperation) {
      case 'google':
        options = new Google(authorization_code);
        break;

      case 'naver':
        let state = req.query.state;
        options = new Naver(authorization_code, state);
        break;

      case 'kakao':
        options = new Kakao(authorization_code);
        break;

      case 'apple':
        break;

      default:
        break;
    }

    // console.log('options= ', options);
    const tokenInfo = await getAccessToken(options);
    // console.log('token = ', tokenInfo);

    if (!tokenInfo) return;
    if (coperation === 'google')
      options.userInfoUrl = `https://www.googleapis.com/oauth2/v2/userinfo?access_token=${tokenInfo.access_token}`;

    const userInfo = await getUserInfo(
      options.userInfoMethod,
      options.userInfoUrl,
      tokenInfo.access_token,
    );
    // console.log('userInfo = ', userInfo);

    //로그인 되었 을 경우
    if (userInfo) {
      if (coperation === 'naver') {
        const { resultcode, reason, response } = userInfo;
        if (resultcode === '00' && reason === 'success') {
          //1. 회원가입 여부 확인
          const memberRow = await authDaoNew.getEmailIsAlreadyExist(email);
          const { EXISTFLAG } = memberRow[0];
          let jwtToken = null;
          let refreshToken = null;
          //회원 가입 안되어있을시
          if (EXISTFLAG === 'NONE') {
            let { jwtToken: access, refreshToken: refresh } = await signUp({
              id,
              email,
              nickname: '',
              social: 'naver',
              isExist: false,
            });
            jwtToken = access;
            refreshToken = refresh;
          } else if (EXISTFLAG === 'EXIST') {
            let { jwtToken: access, refreshToken: refresh } = await signUp({
              id,
              email,
              nickname: '',
              social: 'naver',
              isExist: true,
            });
            jwtToken = access;
            refreshToken = refresh;
          }
          // 발급한 refresh token을 redis에 key를 user의 id로 하여 저장합니다.
          await authDaoNew.setRefreshData({
            id: `${id}_${email}`,
            refreshToken,
          });
          const makedResponse = returnResponse({ res, jwtToken, refreshToken });
          res.json(makedResponse);
        }
      }

      if (coperation === 'kakao') {
        console.log('[kakao] 로그인을 진행합니다.');
        const { kakao_account, id } = userInfo;
        if (id && kakao_account) {
          console.log('[kakao] id, kakao_account 존재합니다.');
          //1. 회원가입 여부 확인
          const { profile, email, has_email } = kakao_account;
          const memberRow = await authDaoNew.getEmailIsAlreadyExist(
            email,
            has_email,
            'kakao',
            id,
          );
          console.log(
            '[kakao] 회원가입 여부 확인합니다 memberRow = ',
            memberRow,
          );
          const { EXISTFLAG } = memberRow[0];
          console.log("'[kakao] EXISTFLAG = ", EXISTFLAG);
          let jwtToken = null;
          let refreshToken = null;
          //회원 가입 안되어있을시
          if (EXISTFLAG === 'NONE') {
            let { jwtToken: access, refreshToken: refresh } = await signUp({
              id,
              email,
              nickname: profile.nickname,
              social: 'kakao',
              isExist: false,
            });
            jwtToken = access;
            refreshToken = refresh;
          } else if (EXISTFLAG === 'EXIST') {
            let { jwtToken: access, refreshToken: refresh } = await signUp({
              id,
              email,
              nickname: profile.nickname,
              social: 'kakao',
              isExist: true,
            });
            jwtToken = access;
            refreshToken = refresh;
          }

          // 발급한 refresh token을 redis에 key를 user의 id로 하여 저장합니다.
          await authDaoNew.setRefreshData({
            id: `${id}_${email}`,
            refreshToken,
          });
          const makedResponse = returnResponse({ res, jwtToken, refreshToken });
          res.json(makedResponse);
        }
      }
      if (coperation === 'google') {
        const { id, email, verified_email, picture } = userInfo;
        if (id && email) {
          //1. 회원가입 여부 확인
          const memberRow = await authDaoNew.getEmailIsAlreadyExist(email);
          const { EXISTFLAG } = memberRow[0];
          let jwtToken = null;
          let refreshToken = null;
          //회원 가입 안되어있을시
          if (EXISTFLAG === 'NONE') {
            let { jwtToken: access, refreshToken: refresh } = await signUp({
              id,
              email,
              nickname: '',
              social: 'google',
              isExist: false,
            });
            jwtToken = access;
            refreshToken = refresh;
          } else if (EXISTFLAG === 'EXIST') {
            let { jwtToken: access, refreshToken: refresh } = await signUp({
              id,
              email,
              nickname: '',
              social: 'google',
              isExist: true,
            });
            jwtToken = access;
            refreshToken = refresh;
          }

          // 발급한 refresh token을 redis에 key를 user의 id로 하여 저장합니다.

          //id 값이 중복되는 것을 방지하기 위해
          //id_social값을 key로 사용한다.
          //await redisClient.set(`${id}_${email}`, refreshToken);
          await authDaoNew.setRefreshData({
            id: `${id}_${email}`,
            refreshToken,
          });
          // await authDaoNew.setRefreshData(email);

          const makedResponse = returnResponse({ res, jwtToken, refreshToken });
          // console.log('makedResponse= ', makedResponse);
          res.json(makedResponse);
        }
      }
    }
  } catch (e) {
    console.log(e);
  }
});

// 영문, 숫자 혼합하여 6~20자리 이내
checkValidationPassword = (password, res) => {
  let reg_pwd = /^.*(?=.{8,20})(?=.*[0-9])(?=.*[a-zA-Z]).*$/;
  if (!reg_pwd.test(password)) {
    console.log('password not vaildation ');
    return false;
  }
  return true;
};

router.get('/test-refresh', async (req, res) => {
  // console.log('hello~');
  res.status(401).json('crash');
});

/* refresh token 발행을 위한 라우터  */
router.get('/refresh', refresh);

router.get('/test', async (req, res) => {
  res.cookie('access-tokens', 'abc', {
    maxAge: 1000 * 60 * 60 * 24 * 1,
    httpOnly: true,
  });
  res.send('hello updated.');
});

router.get('/logout', async (req, res) => {
  res.cookie('access_token', '', {
    maxAge: 0,
  });
  res.cookie('refresh_token', '', {
    maxAge: 0,
  });
  res.send('hello updated.');
});

router.get('/userInfo', async (req, res) => {
  const authorization = await authorizationRequest(req);
  console.log('[userInfo] authorization = ', authorization);
  if (authorization.ok) {
    //...todo 이메일이 없을 경우도
    if (authorization.decoded.email === '') {
      console.log('[userInfo] 이메일이 없습니다.');
    }
    const memberRow = await authDaoNew.getLoginData(
      authorization.decoded.email,
    );
    console.log('[userInfo] getLoginData = ', memberRow);
    if (memberRow[0]) {
      let responseData = {
        code: API_CODE.SUCCESS,
        reason: resMessage.SUCCESS,
        data: memberRow[0],
      };
      res.json(responseData);
      return;
    }
  } else {
    res.json({
      code: API_CODE.INVALID_TOKEN,
      reason: resMessage.INVALID_TOKEN,
      result: '',
    });
  }
});
/* 
  profile
  middleware 적용 
*/
router.get('/profile', authJwt, async (req, res) => {});

module.exports = router;
