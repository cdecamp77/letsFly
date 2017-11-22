var Trip = require('../models/trip');
var Hotel = require('../models/hotel');
var Flight = require('../models/flight');
var request = require('request');
var calendar = require('../utilities/google-calendar');

// moved to TC
function root (req, res) {
    res.render('index', { user: req.user });
}

function flightSearch (req, res) {
    res.render('./flights/search', { user: req.user});
}

// moved to HC
function hotelSearch (req, res) {
    res.render('./hotels/search', { user: req.user });
}

// moved to TC
function index (req, res) {
    Trip.find({}).exec((err, trips) => {
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

// moved to FC
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

function insp (req, res) {
    res.render('./inspiration/inspiration', {user: req.user});
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


// moved to FC
function getFlightData (req, res) {
    var body = req.body;
    var retDate;
    var newTrip = new Trip({departureCity: body.departureCity, arrivalCity: body.arrivalCity, travelers: body.travelers});
    newTrip.save(err => {
        if (err) return res.render('./flights/search', {user: req.user});
        req.user.trips.push(newTrip);
        req.user.save(err => {
            if (err) return res.render('./flights/search', {user: req.user});
            !body.returnDate ? retDate = '' : retDate = `&return_date=${body.returnDate}`;
            request(`https://api.sandbox.amadeus.com/v1.2/flights/low-fare-search?apikey=${process.env.AMADEUS_TOKEN}&origin=${body.departureCity.slice(-4, -1)}&destination=${body.arrivalCity.slice(-4, -1)}&departure_date=${body.departureDate}&adults=${body.travelers}&number_of_results=20${retDate}`, (err, response, flights) => {
                    var searchResults = JSON.parse(flights);
                    console.log(searchResults);
                    res.render('./flights/results', { user: req.user, flightSearchResults: searchResults, tripId: newTrip._id});
            });
        });
    });
}
            
// moved to HC
function getHotelData (req, res) {
    var body = req.body;
    var hotelLocation = location;
    
    request(`https://api.sandbox.amadeus.com/v1.2/hotels/search-airport?apikey=${process.env.AMADEUS_TOKEN}&location=${body.hotelLocation}&check_in=${body.checkin_date}&check_out=${body.checkout_date}&radius=42&number_of_results=10`, (err, response, hotels) => {
        var hotelResults = JSON.parse(hotels);
        res.json(hotelResults).status(200);
    });
}


// moved to TC
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
    flightSearch,
    hotelSearch,
    index,
    createFlights,
    insp,
    getInspirationData,
    updateInspirationData,
    getFlightData,
    getHotelData,
    bookFlights
}