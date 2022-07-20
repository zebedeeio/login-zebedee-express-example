const passport = require('passport');

function initAdmin(app) {
  app.get('/admin', renderAdmin);
}

function renderAdmin(req, res) {
  res.render('admin/dash');
}

function renderProfile(req, res) {
  res.render('user/profile', {
    username: req.user.username,
  });
}

module.exports = initAdmin;
