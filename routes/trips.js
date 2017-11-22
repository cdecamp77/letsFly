var express= require('express');
var router = express.Router();
var tripsCtrl = require('../controllers/trips');

router.get('/', tripsCtrl.root);

// trips/new
router.get('/flights/search', isLoggedIn, tripsCtrl.flightSearch);
router.post('/flights/results', isLoggedIn, tripsCtrl.getFlightData);
router.post('/trips/:id', isLoggedIn, tripsCtrl.bookFlights);
// added post for hotels below
router.get('/hotels/search', isLoggedIn, tripsCtrl.hotelSearch);
router.post('/hotels/search', isLoggedIn, tripsCtrl.getHotelData);

router.get('/trips', isLoggedIn, tripsCtrl.index);

router.get('/inspirations', isLoggedIn, tripsCtrl.insp);
router.post('/inspiration/search', isLoggedIn, tripsCtrl.getInspirationData);
router.post('/inspiration/new', isLoggedIn, tripsCtrl.updateInspirationData);

router.get('/trips/:id/edit', isLoggedIn, tripsCtrl.edit);
router.put('/trips/:id/edit/flights/results', isLoggedIn, tripsCtrl.editTripFlights);
router.post('/trips/:id/edit', isLoggedIn, tripsCtrl.editBookedFlights);
router.delete('/trips/:id', isLoggedIn, tripsCtrl.deleteTrip);
module.exports = router;

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect('/auth/google');
}