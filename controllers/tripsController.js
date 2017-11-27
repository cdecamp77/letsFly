var User = require('../models/user');
var Trip = require('../models/trip');
var request = require('request');
var calendar = require('../utilities/google-calendar');

function root(req, res) {
    res.render('index', { user: req.user });
}

function tripSearch (req, res) {
    res.render('./flights/search', {user: req.user, inspirationDestination: req.destination});
}

function createTripAndGetFlightData(req, res) {
    var body = req.body;
    var retDate;
    var newTrip = new Trip({departureCity: body.departureCity, arrivalCity: body.arrivalCity, travelers: body.travelers, departureDate: new Date(body.departureDate.split('-').join(',')), returnDate: new Date(body.returnDate.split('-').join(','))});
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
            
function bookTripFlights(req, res) {
    var body = req.body;
    Trip.findById(req.params.id, (err, trip) => {
        for (flight in body) {
            var flightObject = body[flight];
            flightObject.departureTime = new Date(flightObject.departureTime);
            flightObject.arrivalTime = new Date(flightObject.arrivalTime);
            trip.flights.push(flightObject);
        }
        trip.save( err => {
            if (err) {
                return res.render('./flights/search', {user: req.user});
            } else {
                res.redirect('/trips');
            }
        });
    });
}

function index(req, res) {
    User.findById(req.user._id).populate('trips').exec((err, user) => {
        user.trips.reverse();
        res.render('./users/dash', {user});
    });
}

function editTrip(req, res) {
    Trip.findById(req.params.id, (err, trip) => {
        if (err) return next(err);
        res.render('./trips/edit', {trip, user: req.user});
    });
}

function editTripAndGetNewFlights(req, res) {
    var body = req.body;
    var retDate;
    Trip.findByIdAndUpdate(req.params.id, {departureCity: body.departureCity, arrivalCity: body.arrivalCity, travelers: body.travelers, departureDate: new Date(body.departureDate.split('-').join(',')), returnDate: new Date(body.returnDate.split('-').join(','))}, (err, trip) => {
        if (err) return res.render(`/trips/${req.params.id}/edit`, {user: req.user});
        !body.returnDate ? retDate = '' : retDate = `&return_date=${body.returnDate}`;
        request(`https://api.sandbox.amadeus.com/v1.2/flights/low-fare-search?apikey=${process.env.AMADEUS_TOKEN}&origin=${body.departureCity.slice(-4, -1)}&destination=${body.arrivalCity.slice(-4, -1)}&departure_date=${body.departureDate}&adults=${body.travelers}&number_of_results=20${retDate}`, (err, response, flights) => {
            var searchResults = JSON.parse(flights);
            res.render('./trips/editFlights', { user: req.user, flightSearchResults: searchResults, tripId: trip._id});
        });
    }); 
}

function editTripBookedFlights(req, res) {
    var body = req.body;
    Trip.findByIdAndUpdate(req.params.id, { $set: { flights: [] }}, (err, trip) => {
        for (flight in body) {
            var flightObject = body[flight];
            flightObject.departureTime = new Date(flightObject.departureTime);
            flightObject.arrivalTime = new Date(flightObject.arrivalTime);
            trip.flights.push(flightObject);
        }
        trip.save( err => {
            if(err) {
            } else {
            res.redirect('/trips');
            }
        });
    });
}

function deleteTrip(req, res) {
    Trip.findByIdAndRemove(req.params.id, (err) => {
       res.redirect('/trips');
    });
}

function error(req, res) {
    res.render('./404.ejs');
}

module.exports = {
    root, 
    tripSearch,
    createTripAndGetFlightData,
    bookTripFlights,
    index,
    editTrip,
    editTripAndGetNewFlights,
    editTripBookedFlights,
    deleteTrip,
    error
}