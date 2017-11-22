var express= require('express');
var router = express.Router();
var tripsCtrl = require('../controllers/trips');


// flight controller
router.get('/trips/:id/flights/results', isLoggedIn, tripsCtrl.flightSearch);
router.post('/trips/:id/flights/results', isLoggedIn, tripsCtrl.getFlightData);

// trips controller
router.get('/', tripsCtrl.root);
router.get('/trips', isLoggedIn, tripsCtrl.index);
router.post('/trips/new', isLoggedIn, tripsCtrl.flightSearch);
//                                                 ^ rename to tripSearch

// get '/trips/new'
// delete '/trips/:id'
// edit '/trips/:id'

// hotel controller
// router.get('/trips/:id/hotels', isLoggedIn, hotelsCtrl.hotelsSearch);
// router.post('/trips/:id/hotels/results', isLoggedIn, hotelsCtrl.getHotelData);


// inspiration controller
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