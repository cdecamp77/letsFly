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
    var searchCompleted = req.body.departureCity;
    if (!searchCompleted) res.render('./inspirations/insp', { user: req.user });
    // `https://api.sandbox.amadeus.com/v1.2/flights/inspiration-search?apikey=${process.env.AMADEUS_TOKEN}&origin=${$('#departure_city').val()}`
}



module.exports = {
    root, 
    flightSearch,
    hotelSearch,
    index,
    insp
}