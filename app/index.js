const path = require('path');

const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const passport = require('passport');
const session = require('express-session');
const RedisStore = require('connect-redis')(session);

const config = require('../config');
const app = express();

app.use(
  bodyParser.urlencoded({
    extended: false,
  }),
);

require('./authentication').init(app);

app.use(
  session({
    secret: config.redisStore.secret,
    resave: false,
    cookie: { path: '/', secure: false, maxAge: null, sameSite: false },
    saveUninitialized: true,
  }),
);

app.use(passport.initialize());
app.use(passport.session());

app.engine(
  '.hbs',
  exphbs({
    defaultLayout: 'layout',
    extname: '.hbs',
    layoutsDir: path.join(__dirname),
    partialsDir: path.join(__dirname),
  }),
);

app.set('view engine', '.hbs');
app.set('views', path.join(__dirname));

require('./user').init(app);
require('./admin').init(app);
require('./note').init(app);
require('./error').init(app);

module.exports = app;
