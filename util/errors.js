module.exports = {
  noNumber: {
    status: 400,
    title: 'value-missing',
    detail: 'No new value to set the number to. Please pass value in request body attributes.'
  },

  invalidNumber: {
    status: 400,
    title: 'value-invalid',
    detail: 'The new value is not an integer. Please pass an integer instead.'
  },

  numberOutOfRange: {
    status: 400,
    title: 'value-out-of-range',
    detail: 'The new value is out of range. Please pass a value that is between 1 and 2147483647'
  },

  noEmailAndPassword: {
    status: 400,
    title: 'email-and-password-missing',
    detail: 'Please pass an email and password in the request body attributes.'
  },

  badEmail: {
    status: 400,
    title: 'email-invalid',
    detail: 'Invalid email format. Please pass a valid email.'
  },

  emailConflict: {
    status: 400,
    title: 'email-conflict',
    detail: 'Email already exists. Did you mean to login?'
  },

  badPassword: {
    status: 400,
    title: 'password-invalid',
    detail: 'Invalid password. Please make sure it\'s at least 8 characters long and doesn\'t contain an unsupported character. Supported characters are "a-z, A-Z, 0-9, !#$%^&*_+=-}{|/.\'`~"'
  },

  invalidJWTHeader: {
    status: 401,
    title: 'authorization-header-invalid',
    detail: 'Invalid JWT token format. Please pass the token in the Authorization header as "Bearer {token}"'
  },

  invalidJWT: {
    status: 401,
    title: 'token-invalid',
    detail: 'Invalid JWT token. Please try logging in again.'
  },

  jwtExpired: {
    status: 401,
    title: 'token-expired',
    detail: 'Your session has expired. Please log back in.'
  },

  wrongEmail: {
    status: 401,
    title: 'email-unknown',
    detail: 'The entered email does not exist. Did you mean to sign up?'
  },

  wrongPassword: {
    status: 401,
    title: 'password-wrong',
    detail: 'The entered password doesn\'t match. Please try again.'
  },

  notFound: {
    status: 404,
    title: 'not-found',
    detail: 'The requested API endpoint was not found.'
  },

  serverError: err => {
    console.error(err)
    return {
      status: 500,
      title: 'internal-server-error',
      detail: err.message
    }
  }
}
