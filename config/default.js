module.exports = {
  port: process.env.PORT,
  origin: "/",
  dbUri: process.env.DBURI,
  saltWorkFactor: process.env.SALTWORKFACTOR,
  accessTokenTtl: process.env.ACCESSTOKENTTL,
  refreshTokenTtl: process.env.REFRESHTOKENTTL,
  googleClientId: process.env.GOOGLECLIENTID,
  googleClientSecret: process.env.GOOGLECLIENTSECRET,
  googleOauthRedirectUrl: "/api/sessions/oauth/google",
};
