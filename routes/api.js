var express = require('express');
var router = express.Router();
var tripsCtrl = require ('../controllers/api/trips');

router.get('/trips', tripsCtrl.getAllTrips);
router.get('/trips/:id', tripsCtrl.getOneTrip);

module.exports = router;