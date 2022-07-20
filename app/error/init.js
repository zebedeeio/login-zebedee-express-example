function initError(app) {
  app.get('/failed', renderFailed);
}

function renderFailed(req, res) {
  console.log('renderFailed')
  res.render('error/failed');
}

module.exports = initError;
