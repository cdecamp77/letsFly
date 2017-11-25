var express= require('express');
var router = express.Router();
var tripsCtrl = require('../controllers/tripsController');

router.get('/', tripsCtrl.root);
router.get('/trips/new', isLoggedIn, tripsCtrl.tripSearch);
router.post('/trips/flights/results', isLoggedIn, tripsCtrl.createTripAndGetFlightData);
router.post('/trips/:id/flights', isLoggedIn, tripsCtrl.bookTripFlights);
router.get('/trips', isLoggedIn, tripsCtrl.index);

router.get('/trips/:id/edit', isLoggedIn, tripsCtrl.editTrip);
router.put('/trips/:id/edit/flights/results', isLoggedIn, tripsCtrl.editTripAndGetNewFlights);
router.post('/trips/:id/edit', isLoggedIn, tripsCtrl.editTripBookedFlights);
router.delete('/trips/:id', isLoggedIn, tripsCtrl.deleteTrip);

module.exports = router;

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect('/auth/google');
}