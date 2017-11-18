var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
    res.render('index', {pageTitle: 'Lets Fly'});
});

module.exports = router;