var Trip = require('../models/trip');
var Hotel = require('../models/hotel');
var Flight = require('../models/flight');
var request = require('request');
var calendar = require('../utilities/google-calendar');
var airports = require('airport-codes');
var cityCoords = require('city-to-coords'); 


function root (req, res) {
    res.render('index', { user: req.user });
}

function flightSearch (req, res) {
    var activeTrip;
    Trip.findOne({active: true}, (err, trip) => {
        if (err) {}
        if (!trip) {
            var newTrip = new Trip();
            if (newTrip.save()) {
                req.user.trips.push(newTrip);
                req.user.save();
                activeTrip = newTrip;
            }
        } else {
            activeTrip = trip;
        }
        res.render('./flights/search', { user: req.user, activeTrip});
    });
}

function hotelSearch (req, res) {
    res.render('./hotels/search', { user: req.user });
}

function index (req, res) {
    Trip.find({}).populate('Flight').populate('Hotel').exec((err, trips) => {
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
        res.render('./users/dash', { trips, user: req.user });
    });
}

function insp (req, res) {
    res.render('./inspiration/inspiration', {user: req.body.user});
}

function getInspirationData (req, res) {
    var body = req.body;
    request({ url: `https://api.sandbox.amadeus.com/v1.2/flights/inspiration-search?apikey=${process.env.AMADEUS_TOKEN}&origin=${body.origin}&destination=${body.destination}`}, (err, response, body) => {
        var searchResults = JSON.parse(body);   
        request(`http://api.sandbox.amadeus.com/v1.2/location/${searchResults.results[0].destination}/?apikey=${process.env.AMADEUS_TOKEN}`, (err, response, body) => {
            searchResults.results[0].city = JSON.parse(body).city;
            request(`https://en.wikipedia.org/w/api.php?action=query&prop=extracts&format=json&exintro=&titles=${encodeURIComponent(searchResults.results[0].city.name)}`, (err, response, body) => {
                searchResults.results[0].description = JSON.parse(body);
                res.json(searchResults).status(200);
            });
        });
    });
}

function updateInspirationData (req, res) {
    var body= req.body;
    var updatedDestination = body.nextDestination;
    request(`http://api.sandbox.amadeus.com/v1.2/location/${body.nextDestination.destination}/?apikey=${process.env.AMADEUS_TOKEN}`, (err, response, body) => {
        updatedDestination.city = JSON.parse(body).city;
        console.log(updatedDestination);
        request(`https://en.wikipedia.org/w/api.php?action=query&prop=extracts&format=json&exintro=&titles=${encodeURIComponent(updatedDestination.city.name)}`, (err, response, body) => {
            updatedDestination.description = JSON.parse(body);
            res.json(updatedDestination).status(200);
        });
    });
}

function getFlightData (req, res) {
    var body = req.body;
    var retDate;
    !body.returnDate ? retDate = '' : retDate = `&return_date=${body.returnDate}`;
    request(`https://api.sandbox.amadeus.com/v1.2/flights/low-fare-search?apikey=${process.env.AMADEUS_TOKEN}&origin=${body.origin}&destination=${body.destination}&departure_date=${body.departureDate}&adults=${body.adults}&number_of_results=20${retDate}`, (err, response, flights) => {
        var searchResults = JSON.parse(flights);
        res.json(searchResults).status(200);
    });
}

// api call to grab hotel info
function getHotelData (req, res) {
    var body = req.body;
    var hotelLocation = location;
    
    request(`https://api.sandbox.amadeus.com/v1.2/hotels/search-airport?apikey=${process.env.AMADEUS_TOKEN}&location=${body.hotelLocation}&check_in=${body.checkin_date}&check_out=${body.checkout_date}&radius=42&number_of_results=10`, (err, response, hotels) => {
        var hotelResults = JSON.parse(hotels);
        res.json(hotelResults).status(200);
    });
}

module.exports = {
    root, 
    flightSearch,
    hotelSearch,
    index,
    insp,
    getInspirationData,
    updateInspirationData,
    getFlightData,
    getHotelData
}