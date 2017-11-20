var express= require('express');
var router = express.Router();
var tripsCtrl = require('../controllers/trips');

router.get('/', tripsCtrl.root);
router.get('/flights/search', tripsCtrl.flightSearch);
router.get('/hotels/search', tripsCtrl.hotelSearch);
router.get('/trips', tripsCtrl.index);
router.get('/inspirations', tripsCtrl.insp);
router.post('/inspirations', tripsCtrl.getAmadeusData);

module.exports = router;