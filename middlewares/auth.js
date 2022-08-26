const { verify } = require('../lib/jwt-util');
const helpers = require('../lib/helpers');

const authMiddleware = (req, res, next) => {
  // read the token from header or url
  const token = req.headers['authorization'] || req.query.token;

  // token does not exist
  if (!token) {
    // const response = helpers.returnResponse('');
    return res.status(403).json({
      code: '4002',
      message: 'not logged in',
      result: null,
    });
  }

  const authToken = token.split('Bearer ')[1];
  console.log('authToken = ', authToken);
  // create a promise that decodes the token
  const p = new Promise((resolve, reject) => {
    const decoded = verify(authToken);
    console.log('decoded = ', decoded);
    if (decoded.ok) {
      resolve(decoded);
    } else {
      reject(decoded);
    }
  });

  // if it has failed to verify, it will return an error message
  const onError = (error) => {
    res.status(403).json({
      code: '4000',
      message: error.message,
      result: null,
    });
  };

  // process the promise
  p.then((decoded) => {
    req.decoded = decoded;
    next();
  }).catch(onError);
};

module.exports = authMiddleware;
