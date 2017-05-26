let jwt    = require('jsonwebtoken');
let bcrypt = require('bcrypt');

const {
  secretKey,
  tokenExpiresIn : expiresIn
} = require('../config');

module.exports = {
  TokenExpiredError: jwt.TokenExpiredError,

  verify: token => new Promise(
    (resolve, reject) => jwt.verify(
      token,
      secretKey,
      (err, payload) => err ? reject(err) : resolve(payload)
    )
  ),

  signJWT: id => ({
    id,
    token: jwt.sign({ sub: id }, secretKey, { expiresIn }),
    expiresIn: expiresIn + 's'
  }),

  hash: str => bcrypt.hash(str, 10),

  compareHash: (str, hashedStr) => bcrypt.compare(str, hashedStr)
}
