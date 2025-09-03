module.exports = {
  port: process.env.PORT,
  origin: process.env.ORIGIN,
  dbUri: process.env.DBURI,
  saltWorkFactor: process.env.SALTWORKFACTOR,
  accessTokenTtl: process.env.ACCESSTOKENTTL,
  refreshTokenTtl: process.env.REFRESHTOKENTTL,
  googleClientId: process.env.GOOGLECLIENTID,
  googleClientSecret: process.env.GOOGLECLIENTSECRET,
  googleOauthRedirectUrl:
    "https://rest-api-backend-4zf8.onrender.com/api/sessions/oauth/google",
};
