module.exports = {
  serverPort: process.env.PORT || '3000',

  username: process.env.DB_USER || 'mujz',
  password: process.env.DB_PASSWORD || 'thinkific',
  database: process.env.DB_NAME || 'ipp',
  host:     process.env.DB_HOST || 'ipp_db',
  dialect:  'postgres',

  secretKey : process.env.SECRET_KEY || 'my,secret,key',
  tokenExpiresIn : process.env.AUTH_TOKEN_EXPIRATION_INTERVAL_IN_SECONDS || `${60*60}`
}
