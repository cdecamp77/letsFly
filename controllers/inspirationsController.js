var User = require('../models/user');
var Trip = require('../models/trip');
var request = require('request');
var calendar = require('../utilities/google-calendar');

function showInspirationPage (req, res) {
    res.render('./inspirations/inspirations', {user: req.user});
}

function getInspirationData (req, res) {
    var body = req.body;
    request({ url: `https://api.sandbox.amadeus.com/v1.2/flights/inspiration-search?apikey=${process.env.AMADEUS_TOKEN}&origin=${body.origin}`}, (err, response, body) => {
        var searchResults = JSON.parse(body);   
        request(`http://api.sandbox.amadeus.com/v1.2/location/${searchResults.results[0].destination}/?apikey=${process.env.AMADEUS_TOKEN}`, (err, response, body) => {
            searchResults.results[0].city = JSON.parse(body).city;
            var state;
            !searchResults.results[0].city.state ? state = '' : state = `, ${searchResults.results[0].city.state}`;
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
        request(`https://en.wikipedia.org/w/api.php?action=query&prop=extracts&format=json&exintro=&titles=${encodeURIComponent(updatedDestination.city.name)}`, (err, response, body) => {
            updatedDestination.description = JSON.parse(body);
            res.json(updatedDestination).status(200);
        });
    });
}

module.exports = {
    showInspirationPage,
    getInspirationData,
    updateInspirationData
}



