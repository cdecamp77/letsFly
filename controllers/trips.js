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

function getAmadeusData (req, res) {

}

module.exports = {
    root, 
    flightSearch,
    hotelSearch,
    index,
    insp,
    getAmadeusData
}