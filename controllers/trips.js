var Trip = require('../models/trip');
var Hotel = require('../models/hotel');
var Flight = require('../models/flight');

function root (req, res) {
    res.render('index', { user: req.user });
}

function flightSearch (req, res) {
    res.render('/flights/search', { user: req.user });
}

function hotelSearch (req, res) {
    res.render('/hotels/search', { user: req.user });
}

function index (req, res) {
    Trip.find({}).populate('Flight').populate('Hotel').exec((err, trips) => {
        res.render('/users/dash', { trips, user: req.user });
    });
}

function insp (req, res) {
    res.render('/inspirations/insp', { user: req.user });
}



module.exports = {
    root, 
    flightSearch,
    hotelSearch,
    index,
    insp
}