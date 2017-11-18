var express = require('express');
var router = express.Router();
var tripsCtrl = require ('../controllers/api/trips');

/* GET /api/puppies */
router.get('/api/trips', tripsCtrl.getAllTrips);
router.get('/api/trips/:id', tripsCtrl.getOneTrip);


module.exports = router;