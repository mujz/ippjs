let JSONAPISerializer = require('jsonapi-serializer').Serializer;

module.exports = {
  NumberSerializer: new JSONAPISerializer('number', {
    attributes: ['value']
  }),

  TokenSerializer: new JSONAPISerializer('token', {
    attributes: ['token', 'expiresIn']
  })
}
