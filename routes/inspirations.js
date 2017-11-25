var express= require('express');
var router = express.Router();
var inspCtrl = require('../controllers/inspirationsController');

router.get('/inspirations', isLoggedIn, inspCtrl.showInspirationPage);
router.post('/inspirations/search', isLoggedIn, inspCtrl.getInspirationData);
router.post('/inspirations/new', isLoggedIn, inspCtrl.updateInspirationData);

module.exports = router;

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect('/auth/google');
}