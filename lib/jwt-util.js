require('dotenv').config();
// const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const authDaoNew = require('../model/mysql/authDaoNew');
// const redisClient = require('./redis');
const secret = process.env.JWT_SECRET;

module.exports = {
  sign: (payload) => {
    // access token 발급
    // const payload = {
    //   // access token에 들어갈 payload
    //   id: user.id,
    //   role: user.role,
    // };
    // console.log(secret);
    return jwt.sign(payload, secret, {
      // secret으로 sign하여 발급하고 return
      algorithm: 'HS256', // 암호화 알고리즘
      expiresIn: '1m',
      //expiresIn: '4h', // 유효기간
    });
  },
  verify: (token) => {
    // access token 검증
    let decoded = null;
    try {
      console.log('[jwt-utll] token = ', token);
      decoded = jwt.verify(token, secret);
      console.log('[jwt-utll] decoded = ', decoded);
      if (!decoded) {
        return {
          ok: false,
          reason: err.message,
        };
      }
      return {
        ok: true,
        id: decoded.id,
        role: decoded.role,
        decoded: decoded,
      };
    } catch (err) {
      console.log('[jwt-utll] err = ', err.message);
      return {
        ok: false,
        reason: err.message,
      };
    }
  },
  refresh: () => {
    // refresh token 발급
    return jwt.sign({}, secret, {
      // refresh token은 payload 없이 발급
      algorithm: 'HS256',
      expiresIn: '14d',
    });
  },

  // refreshVerify: async (token, userId) => {
  //   // refresh token 검증
  //   try {
  //     const data = await authDaoNew.getRefreshData({ id: userId });
  //     // const data = await getAsync(userId); // refresh token 가져오기
  //     console.log('[refreshVerify] data= ', data);
  //     if (token === data[0].REFRESH_TOKEN) {
  //       try {
  //         jwt.verify(token, secret);
  //         return true;
  //       } catch (err) {
  //         return false;
  //       }
  //     } else {
  //       return false;
  //     }
  //   } catch (err) {
  //     return false;
  //   }
  // },

  //db에 있는지
  refreshVerifyDatabase: async (refreshToken, userId) => {
    try {
      let data = null;
      if (userId) {
        data = await authDaoNew.getRefreshData({ id: userId });
        if (refreshToken === data[0].REFRESH_TOKEN) {
          return {
            ok: true,
          };
        } else {
          return {
            ok: false,
          };
        }
      }
      // access token이 expired 된 경우
      if (!userId) {
        data = await authDaoNew.getRefreshDataToRefresh({ refreshToken });
        if (!data) {
          return {
            ok: false,
          };
        }
        return {
          ok: true,
          data,
        };
      }
    } catch (err) {
      return {
        ok: false,
      };
    }
  },
};
