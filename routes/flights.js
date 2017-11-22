var express= require('express');
var router = express.Router();
var flightCtrl = require('../controllers/flightController');

router.get('/flights/search', isLoggedIn, flightCtrl.flightSearch);
router.post('/flights/search', isLoggedIn, flightCtrl.getFlightData);

module.exports = router;

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect('/auth/google');
}