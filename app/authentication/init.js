const passport = require('passport');
const bcrypt = require('bcrypt');
const LocalStrategy = require('passport-local').Strategy;
const ZebedeeStrategy = require('passport-zebedee-alpha');

const authenticationMiddleware = require('./middleware');

function findUser(user, callback) {
  return callback(null, {
    lightningAddress: user.lightningAddress,
    email: user.email,
    username: user.username,
  });
}

passport.serializeUser(function (user, cb) {
  cb(null, {
    lightningAddress: user.lightningAddress,
    email: user.email,
    username: user.username,
  });
});

passport.deserializeUser(function (user, cb) {
  findUser(user, cb);
});

function initPassport(req, res) {
  passport.use(
    new LocalStrategy((username, password, done) => {
      findUser(username, (err, user) => {
        if (err) {
          return done(err);
        }

        // User not found
        if (!user) {
          return done(null, false);
        }

        // Always use hashed passwords and fixed time comparison
        bcrypt.compare(password, user.passwordHash, (err, isValid) => {
          if (err) {
            return done(err);
          }
          if (!isValid) {
            return done(null, false);
          }
          return done(null, user);
        });
      });
    }),
  );

  passport.use(
    new ZebedeeStrategy(
      {
        clientID: '<your_client_id>',
        clientSecret: '<your_client_secret>',
        callbackURL: '<your_redirect_url',
        authorizationURL: 'https://api.zebedee.io/v0/oauth2/authorize',
        tokenURL: 'https://api.zebedee.io/v0/oauth2/token',
        userProfileURL: 'https://api.zebedee.io/v0/oauth2/user',
        pkce: true,
        state: true,
      },
      function (accessToken, refreshToken, profile, cb) {
        console.log('token is:', accessToken);
        console.log('refresh token is:', refreshToken);
        console.log('Profile is', profile);
        cb(null, {
          username: profile.gamertag,
          lightningAddress: profile.lightningAddress,
          email: profile.email,
        });
      },
    ),
  );

  passport.authenticationMiddleware = authenticationMiddleware;
}

module.exports = initPassport;
