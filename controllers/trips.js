var User = require('../models/user');
var Trip = require('../models/trip');
var Hotel = require('../models/hotel');
var Flight = require('../models/flight');
var request = require('request');
var calendar = require('../utilities/google-calendar');


function root (req, res) {
    res.render('index', { user: req.user });
}

function flightSearch (req, res) {
    res.render('./flights/search', { user: req.user});
}

function hotelSearch (req, res) {
    res.render('./hotels/search', { user: req.user });
}

function index (req, res) {
    User.findById(req.user._id).populate('trips').exec((err, user) => {
        res.render('./users/dash', {user});
    });
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
                    console.log(searchResults);
                    res.render('./flights/results', { user: req.user, flightSearchResults: searchResults, tripId: newTrip._id});
            });
        });
    });
}
            
// api call to grab hotel info
function getHotelData (req, res) {
    var body = req.body;
    var hotelLocation = location;
    
    request(`https://api.sandbox.amadeus.com/v1.2/hotels/search-airport?apikey=${process.env.AMADEUS_TOKEN}&location=${body.hotelLocation}&check_in=${body.checkin_date}&check_out=${body.checkout_date}&radius=42&number_of_results=10`, (err, response, hotels) => {
        var hotelResults = JSON.parse(hotels);
        res.json(hotelResults).status(200);
    });
}

function bookFlights(req, res) {
    var body = req.body;
    Trip.findById(req.params.id, (err, trip) => {
        for (flight in body) {
            var flightObject = body[flight];
            flightObject.departureTime = Date.parse(flightObject.departureTime);
            flightObject.arrivalTime = Date.parse(flightObject.arrivalTime);
            console.log(flightObject);
            // var newFlight = {outbound: flightObject.outbound, origin: flightObject.origin, destination: flightObject.destination, departureTime: Date.parse(flightObject.departureTime), arrivalTime: Date.parse(flightObject.arrivalTime), airline: flightObject.airline, flightNumber: flightObject.flightNumber};
            trip.flights.push(flightObject);
        }
        trip.save( err => {
            // if (err) return res.render('./flights/search', {user: req.user});
            if(err) {
                console.log(err);
            } else {
            console.log(trip);
            res.redirect('/trips');
            }
        })
    })
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
            console.log(flightObject);
            // var newFlight = {outbound: flightObject.outbound, origin: flightObject.origin, destination: flightObject.destination, departureTime: Date.parse(flightObject.departureTime), arrivalTime: Date.parse(flightObject.arrivalTime), airline: flightObject.airline, flightNumber: flightObject.flightNumber};
            trip.flights.push(flightObject);
        }
        trip.save( err => {
            // if (err) return res.render('./flights/search', {user: req.user});
            if(err) {
                console.log(err);
            } else {
            console.log(trip);
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
    flightSearch,
    hotelSearch,
    index,
    createFlights,
    insp,
    getInspirationData,
    updateInspirationData,
    getFlightData,
    getHotelData,
    bookFlights,
    edit,
    editTripFlights,
    editBookedFlights,
    deleteTrip
}