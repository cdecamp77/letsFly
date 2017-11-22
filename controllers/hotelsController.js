var Hotel = require('../models/hotel');
var hotelCtrl = require('../controllers/hotelsController');

function hotelSearch (req, res) {
    res.render('./trips/:id/hotels/results', { user: req.user });
}

function getHotelData (req, res) {
    var body = req.body;
    var hotelLocation = location;
    
    request(`https://api.sandbox.amadeus.com/v1.2/hotels/search-airport?apikey=${process.env.AMADEUS_TOKEN}&location=${body.hotelLocation}&check_in=${body.checkin_date}&check_out=${body.checkout_date}&radius=42&number_of_results=10`, (err, response, hotels) => {
        var hotelResults = JSON.parse(hotels);
        res.json(hotelResults).status(200);
    });
}

module.exports = {
    hotelSearch,
    getHotelData
}


        // calendar.addEvent(req.user.googleToken, 'destination', new Date().toISOString(), new Date().toISOString())
        // .then(function(events) {
        //     console.log(events);
        // });
        // calendar.listEvents(req.user.googleToken)
        // .then(function(response) {
        //     console.log(response);
        // })
        // .catch(function(err) {
        //     console.log(err);
        // });