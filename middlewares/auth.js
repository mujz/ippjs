let errors = require('../util/errors');
let authUtil = require('../util/auth');

const jwtRegex = /^bearer\s+.+$/i;
const extractJWTRegex = /^bearer\s+/i;

module.exports = {
  auth: (req, res, next) => {
    // Sanitize Authorization header
    let token = req.headers.authorization || '';
    if (!jwtRegex.test(token)) {
      return next(errors.invalidJWTHeader);
    }
    token = token.replace(extractJWTRegex, '');

    // Verify the token and set req.userId
    authUtil.verify(token)
      .then(payload => {
        req.userId = payload.sub;
        next();
      })
      .catch(err => next(err.constructor === authUtil.TokenExpiredError ? errors.jwtExpired : errors.invalidJWT))
  }
}
