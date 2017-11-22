var express = require('express');
var router = express.Router();
var flightsCtrl = require('../controllers/flightsController');


router.post('/trips/:id/flights/results', isLoggedIn, flightsCtrl.getFlightData);
router.post('/trips/:id/flights', isLoggedIn, flightsCtrl.bookFlights);

module.exports = router;

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect('/auth/google');
}