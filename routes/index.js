let { User, Sequelize: { UniqueConstraintError } }  = require('../models');
let express = require('express');
let router  = express.Router();

let { validateUser, validateNumber } = require('../middlewares/validator')
let { auth } = require('../middlewares/auth')

let errors = require('../util/errors');
let authUtil = require('../util/auth')
let { TokenSerializer, NumberSerializer } = require('../util/jsonapi')

router.post('/signup',
  validateUser,
  (req, res, next) => authUtil.hash(req.body.data.attributes.password)
  .then(password => User.create({
    email: req.body.data.attributes.email,
    password
  }))
  .then(user => authUtil.signJWT(user.id))
  .then(token => TokenSerializer.serialize(token))
  .then(jsonapi => res.send(jsonapi))
  .catch(err => err instanceof UniqueConstraintError ?
    next(errors.emailConflict) :
    next(errors.serverError(err))
  )
);

router.post('/login',
  validateUser,
  (req, res, next) => User.scope('withPassword').findOne({
    where: {
      email: req.body.data.attributes.email
    }
  })
  .then(user => user ?
    [authUtil.compareHash(req.body.data.attributes.password, user.password), user] :
    next(errors.wrongEmail)
  )
  .then(data => data[0] ? authUtil.signJWT(data[1].id) : next(errors.wrongPassword))
  .then(token => TokenSerializer.serialize(token))
  .then(jsonapi => res.send(jsonapi))
  .catch(err => next(errors.serverError(err)))
);

router.get('/next',
  auth,
  (req, res, next) => User.increment(req.userId)
  .then(number => NumberSerializer.serialize(number))
  .then(jsonapi => res.send(jsonapi))
  .catch(err => next(errors.serverError(err)))
);

router.get('/current',
  auth,
  (req, res, next) => User.findById(req.userId)
  .then(number => NumberSerializer.serialize(number))
  .then(jsonapi => res.send(jsonapi))
  .catch(err => next(errors.serverError(err)))
);

router.put('/current',
  auth,
  validateNumber,
  (req, res, next) => User.update({
    value: req.body.data.attributes.value
  }, {
    where: { id: req.userId },
    returning: true
  })
  .spread((affectedRowsCount, instances) => instances[0])
  .then(number => NumberSerializer.serialize(number))
  .then(jsonapi => res.send(jsonapi))
  .catch(err => next(errors.serverError(err)))
);

module.exports = router;
