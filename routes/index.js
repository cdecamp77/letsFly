var express = require('express');
var router = express.Router();
var passport = require('passport');
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/auth/google', passport.authenticate(
  'google', 
  { scope: ['profile', 'email']}
));

router.get('/oauth2callback', passport.authenticate(
  'google',
  {
    successRedirect: '/',
    failureRedirect: '/'
  }
));

router.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});

router.get('/', function(req, res) {
  res.render('index', { user: req.user });
});


module.exports = router;
