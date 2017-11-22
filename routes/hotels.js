var express= require('express');
var router = express.Router();
var hotelCtrl = require('../controllers/hotelController');

router.get('/hotels/search', isLoggedIn, hotelCtrl.hotelSearch);
router.post('/hotels/search', isLoggedIn, hotelCtrl.getHotelData);

module.exports = router;

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect('/auth/google');
}