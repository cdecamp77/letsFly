var User = require('../models/user');
var Trip = require('../models/trip');
var Hotel = require('../models/hotel');
var Flight = require('../models/flight');
var request = require('request');
var calendar = require('../utilities/google-calendar');

function root (req, res) {
    res.render('index', { user: req.user });
}

function tripSearch (req, res) {
    res.render('./flights/search', {user: req.user, inspirationDestination: req.destination});
}

function getFlightData (req, res) {
    var body = req.body;
    var retDate;
    var newTrip = new Trip({departureCity: body.departureCity, arrivalCity: body.arrivalCity, travelers: body.travelers, departureDate: Date.parse(body.departureDate), returnDate: Date.parse(body.returnDate)});
    newTrip.save(err => {
        if (err) return res.render('./flights/search', {user: req.user});
        req.user.trips.push(newTrip);
        req.user.save(err => {
            if (err) return res.render('./flights/search', {user: req.user});
            !body.returnDate ? retDate = '' : retDate = `&return_date=${body.returnDate}`;
            request(`https://api.sandbox.amadeus.com/v1.2/flights/low-fare-search?apikey=${process.env.AMADEUS_TOKEN}&origin=${body.departureCity.slice(-4, -1)}&destination=${body.arrivalCity.slice(-4, -1)}&departure_date=${body.departureDate}&adults=${body.travelers}&number_of_results=20${retDate}`, (err, response, flights) => {
                    var searchResults = JSON.parse(flights);
                    res.render('./flights/results', { user: req.user, flightSearchResults: searchResults, tripId: newTrip._id});
            });
        });
    });
}
            
function bookFlights(req, res) {
    var body = req.body;
    Trip.findById(req.params.id, (err, trip) => {
    
        for (flight in body) {
            var flightObject = body[flight];
            // calendar.addEvent(req.user.googleToken, 'destination', flightObject.departureTime, flightObject.arrivalTime)
            flightObject.departureTime = Date.parse(flightObject.departureTime);
            flightObject.arrivalTime = Date.parse(flightObject.arrivalTime);
            // var newFlight = {outbound: flightObject.outbound, origin: flightObject.origin, destination: flightObject.destination, departureTime: Date.parse(flightObject.departureTime), arrivalTime: Date.parse(flightObject.arrivalTime), airline: flightObject.airline, flightNumber: flightObject.flightNumber};
            trip.flights.push(flightObject);
        }
        trip.save( err => {
            // if (err) return res.render('./flights/search', {user: req.user});
            if(err) {
                console.log(err);
            } else {
            res.redirect('/trips');
            }
        })
    })
}

function index (req, res) {
    User.findById(req.user._id).populate('trips').exec((err, user) => {
        user.trips.reverse();
        res.render('./users/dash', {user});
    });
}

function edit(req, res) {
    Trip.findById(req.params.id, (err, trip) => {
        if (err) return next(err);
        res.render('./trips/edit', {trip, user: req.user});
    });
}

function editTripFlights(req, res) {
    var body = req.body;
    var retDate;
    Trip.findByIdAndUpdate(req.params.id, {departureCity: body.departureCity, arrivalCity: body.arrivalCity, travelers: body.travelers, departureDate: Date.parse(body.departureDate), returnDate: Date.parse(body.returnDate)}, (err, trip) => {
        if (err) return res.render(`/trips/${req.params.id}/edit`, {user: req.user});
        !body.returnDate ? retDate = '' : retDate = `&return_date=${body.returnDate}`;
        request(`https://api.sandbox.amadeus.com/v1.2/flights/low-fare-search?apikey=${process.env.AMADEUS_TOKEN}&origin=${body.departureCity.slice(-4, -1)}&destination=${body.arrivalCity.slice(-4, -1)}&departure_date=${body.departureDate}&adults=${body.travelers}&number_of_results=20${retDate}`, (err, response, flights) => {
            var searchResults = JSON.parse(flights);
            console.log(searchResults);
            res.render('./trips/editFlights', { user: req.user, flightSearchResults: searchResults, tripId: trip._id});
        });
    }); 
}

function editBookedFlights(req, res) {
    var body = req.body;
    Trip.findByIdAndUpdate(req.params.id, { $set: { flights: [] }}, (err, trip) => {
        for (flight in body) {
            var flightObject = body[flight];
            flightObject.departureTime = Date.parse(flightObject.departureTime);
            flightObject.arrivalTime = Date.parse(flightObject.arrivalTime);
            // var newFlight = {outbound: flightObject.outbound, origin: flightObject.origin, destination: flightObject.destination, departureTime: Date.parse(flightObject.departureTime), arrivalTime: Date.parse(flightObject.arrivalTime), airline: flightObject.airline, flightNumber: flightObject.flightNumber};
            trip.flights.push(flightObject);
        }
        trip.save( err => {
            // if (err) return res.render('./flights/search', {user: req.user});
            if(err) {
                console.log(err);
            } else {
            res.redirect('/trips');
            }
        })
    })
}

function deleteTrip(req, res) {
    Trip.findByIdAndRemove(req.params.id, (err) => {
       res.redirect('/trips');
    })
}

module.exports = {
    root, 
    tripSearch,
    getFlightData,
    bookFlights,
    index,
    edit,
    editTripFlights,
    editBookedFlights,
    deleteTrip
}