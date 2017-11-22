var Trip = require('../models/trip');
var request = require('request');
var calendar = require('../utilities/google-calendar');

function root (req, res) {
    res.render('index', { user: req.user });
}

function index (req, res) {
    Trip.find({}).exec((err, trips) => {
        res.render('./users/dash', { trips, user: req.user });
    });
}

function createFlights(req, res) {
    var itinerary = req.body.itinerary;
    var price = req.body.price
    itinerary.outbound.flights.forEach(flight => {
        var newFlight = new Flight({outbound: true, origin: flight.origin.airport, destination: flight.destination.airport, departureTime: Date.parse(flight.departs_at), arrivalTime: Date.parse(flight.arrives_at), marketingAirline: flight.marketing_airline, operatingAirline: flight.operating_airline, flightNumber: flight.flight_number});
        newFlight.save();
        User.findById(req.user._id).populate('trips').find({'trips.active': true}).exec((err, user) => {
            user.trips.find({active: true}, (err, trip) => {
                trip.flightsCost = price;
                trip.flights.push()
    });
        })
    })
}

function bookFlights(req, res) {
    var body = req.body;
    Trip.findById(req.params.id, (err, trip) => {
        for (flight in body) {
            var newFlight = {outbound: body[flight].outbound, origin: body[flight].origin, destination: body[flight].destination, departureTime: Date.parse(body[flight].departureTime), arrivalTime: Date.parse(body[flight].arrivalTime), airline: body[flight].airline, flightNumber: body[flight].flightNumber};
            trip.flights.push(newFlight);
        }
        trip.save( err => {
            // if (err) return res.render('./flights/search', {user: req.user});
            console.log(trip);
            res.redirect('/trips');
        })
    })
}

module.exports = {
    root,
    index,
    createFlights,
    bookFlights
}