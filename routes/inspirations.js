var express= require('express');
var router = express.Router();
var tripsCtrl = require('../controllers/inspirationsController');

router.get('/inspirations', isLoggedIn, tripsCtrl.insp);
router.post('/inspiration/search', isLoggedIn, tripsCtrl.getInspirationData);
router.post('/inspiration/new', isLoggedIn, tripsCtrl.updateInspirationData);

module.exports = router;

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect('/auth/google');
}