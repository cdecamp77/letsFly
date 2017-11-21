var express= require('express');
var router = express.Router();
var tripsCtrl = require('../controllers/trips');

router.get('/', tripsCtrl.root);
router.get('/flights/search', tripsCtrl.flightSearch);
router.post('/flights/search', tripsCtrl.getFlightData);
router.get('/hotels/search', tripsCtrl.hotelSearch);
router.get('/trips', tripsCtrl.index);
router.get('/inspirations', tripsCtrl.insp);
router.get('/users/dash', tripsCtrl.index)
router.post('/inspiration/search', tripsCtrl.getInspirationData);
router.post('/inspiration/new', tripsCtrl.updateInspirationData);


module.exports = router;