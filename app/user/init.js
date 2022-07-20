const passport = require('passport');
const ZebedeeStrategy = require('passport-zebedee-alpha');

function initUser(app) {
  app.get('/', (req, res) => {
    console.log('REQ KEYS ===', req.session.keys);
    renderWelcome(req, res);
  });
  // app.get('/profile', passport.authenticationMiddleware(), renderProfile)
  app.get('/profile', renderProfile);
  app.get('/admin', renderAdmin);
  app.post(
    '/login',
    passport.authenticate('local', {
      successRedirect: '/profile',
      failureRedirect: '/',
    }),
  );
  app.post('/set-client', async (req, res) => {
    console.log('BODY PARAMS SET', await req.body);
    req.session.keys = await req.body;
    res.redirect(`/?${new URLSearchParams(req.body).toString()}`);
  });
  app.get('/zebedee', (req, res) => {
    console.log('REQ === ', req.session);
    if (req.session.keys) {
      passport.use(
        new ZebedeeStrategy(
          {
            clientID:
              req.session?.keys?.client_id ||
              'e0b1258d-ddae-4f6c-9a46-fd3314cdb9d0', // TEST ENV
            // clientID: '52cf1d0d-2a44-41e4-a809-4335193e55be', // DEV ENVIRONMENT
            clientSecret:
              req.session?.keys?.client_secret ||
              '5537ab0c-67ca-475b-ab8a-cc1aab2cef82', // TEST ENV
            // clientSecret: '1fd5b0ce-1f9e-4ef1-9280-726a8e0ea778', // DEV ENVIRONMENT
            // callbackURL:
            //   req.session?.keys?.redirect_url ||
            //   'https://zebedee-partner.herokuapp.com/zebedee/callback',
            callbackURL:
              req.session?.keys?.redirect_url ||
              'http://localhost:3000/zebedee/callback',
            authorizationURL: 'https://test.zebedee.io/v0/oauth2/authorize',
            tokenURL: 'https://test.zebedee.io/v0/oauth2/token',
            userProfileURL: 'https://test.zebedee.io/v0/oauth2/user',
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
    }
    res.redirect('/zebedee/passport');
  });
  app.get(
    '/zebedee/passport',
    passport.authenticate('zebedee', {
      scope: ['user'],
    }),
  );
  app.get(
    '/zebedee/callback',
    passport.authenticate('zebedee', {
      failureRedirect: '/failed',
    }),
    function (req, res) {
      res.redirect('/profile');
    },
  );
}

function renderWelcome(req, res) {
  res.render('user/welcome');
}

function renderAdmin(req, res) {
  res.render('user/admin');
}

function renderProfile(req, res) {
  res.render('user/profile', {
    lightningAddress: req.user.lightningAddress,
    email: req.user.email,
    username: req.user.username,
  });
}

module.exports = initUser;
