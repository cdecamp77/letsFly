var express = require('express');
var router = express.Router();
var tripsCtrl = require ('../controllers/api/trips');

/* GET /api/puppies */
router.get('/trips', tripsCtrl.getAllTrips);
router.get('/trips/:id', tripsCtrl.getOneTrip);


module.exports = router;