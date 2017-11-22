var express= require('express');
var router = express.Router();
var hotelsCtrl = require('../controllers/hotelsController');

router.get('/trips/:id/hotels/results', isLoggedIn, hotelsCtrl.hotelSearch);
router.post('/trips/:id/hotels', isLoggedIn, hotelsCtrl.getHotelData);

// edit hotels

module.exports = router;

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect('/auth/google');
}