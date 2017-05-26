let errors = require('../util/errors');

const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const passwordRegex = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]{8,}$/;

const minNum = 1,
  maxNum = 2147483647;

module.exports = {
  validateUser: (req, res, next) => {
    if (!req.body.data || !req.body.data.attributes) {
      return next(errors.noEmailAndPassword);
    } else if (!emailRegex.test(req.body.data.attributes.email)) {
      return next(errors.badEmail);
    } else if (!passwordRegex.test(req.body.data.attributes.password)) {
      return next(errors.badPassword);
    }
    return next();
  },

  validateNumber: (req, res, next) => {
    if (!req.body.data, !req.body.data.attributes) {
      return next(errors.noNumber);
    }

    let n = parseInt(req.body.data.attributes.value, 10);

    if (!Number.isSafeInteger(n)) {
      return next(errors.invalidNumber);
    } else if(n < minNum || n > maxNum) {
      return next(errors.numberOutOfRange)
    }

    return next();
  }
}
