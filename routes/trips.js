var express= require('express');
var router = express.Router();
var tripsCtrl = require('../controllers/trips');

router.get('/', tripsCtrl.root);
router.get('/flights/search', isLoggedIn, tripsCtrl.flightSearch);
router.post('/flights/search', isLoggedIn, tripsCtrl.getFlightData);
router.get('/hotels/search', isLoggedIn, tripsCtrl.hotelSearch);
// added post for hotels below
router.post('/hotels/search', isLoggedIn, tripsCtrl.getHotelData);

router.get('/trips', isLoggedIn, tripsCtrl.index);
router.get('/inspirations', isLoggedIn, tripsCtrl.insp);
router.get('/users/dash', isLoggedIn, tripsCtrl.index);
router.post('/users/dash', isLoggedIn, tripsCtrl.createFlights);
router.post('/inspiration/search', isLoggedIn, tripsCtrl.getInspirationData);
router.post('/inspiration/new', isLoggedIn, tripsCtrl.updateInspirationData);


module.exports = router;

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect('/auth/google');
}