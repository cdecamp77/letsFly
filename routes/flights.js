var express = require('express');
var router = express.Router();
var flightsCtrl = require('../controllers/flightsController');


router.post('/trips/:id/flights/results', isLoggedIn, flightsCtrl.getFlightData);


module.exports = router;

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect('/auth/google');
}