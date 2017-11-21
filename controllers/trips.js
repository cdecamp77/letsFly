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
    res.render('./flights/search', { user: req.user });
}

function hotelSearch (req, res) {
    res.render('./hotels/search', { user: req.user });
}

function index (req, res) {
    Trip.find({}).populate('Flight').populate('Hotel').exec((err, trips) => {
        // calendar.addEvent(req.user.googleToken, 'This is my new event', new Date('11/21/2017 17:00' ).toISOString(), new Date('11/21/2017 19:00').toISOString())
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
    request(`https://api.sandbox.amadeus.com/v1.2/flights/low-fare-search?apikey=${process.env.AMADEUS_TOKEN}&origin=${body.origin}&destination=${body.destination}&departure_date=${body.departureDate}&return_date=${body.returnDate}&adults=${body.adults}`, (err, response, flights) => {
        var searchResults = JSON.parse(flights);
        res.json(searchResults).status(200);
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
    getFlightData
}