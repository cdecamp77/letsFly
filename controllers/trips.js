var Trip = require('../models/trip');
var Hotel = require('../models/hotel');
var Flight = require('../models/flight');
var request = require('request');

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
        res.render('./users/dash', { trips, user: req.user });
    });
}

function insp (req, res) {
    res.render('./inspiration/inspiration', {user: req.body.user});
}

function getAmadeusData (req, res) {
    var body = req.body;
    request({ url: `https://api.sandbox.amadeus.com/v1.2/flights/inspiration-search?apikey=${process.env.AMADEUS_TOKEN}&origin=${body.origin}&destination=${body.destination}`}, (err, response, body) => {
        var searchResults = JSON.parse(body);
        res.json(searchResults);
    });
}



module.exports = {
    root, 
    flightSearch,
    hotelSearch,
    index,
    insp,
    getAmadeusData
}