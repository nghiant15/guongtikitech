const configFB = require('./configFB');

passport.use(new FacebookStrategy({
    clientID: configFB.facebook_key,
    clientSecret:configFB.facebook_secret ,
    callbackURL: configFB.callback_url
  },
  function(accessToken, refreshToken, profile, done) {
    process.nextTick(function () {
      //Check whether the User exists or not using profile.id
      if(config.use_database) {
         //Further code of Database.
      }
      return done(null, profile);
    });
  }
));