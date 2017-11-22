var Flight = require('../models/flight');


function flightSearch (req, res) {
    var activeTrip;
    Trip.findOne({active: true}, (err, trip) => {
        if (err) {}
        if (!trip) {
            var newTrip = new Trip();
            if (newTrip.save()) {
                req.user.trips.push(newTrip);
                req.user.save();
                activeTrip = newTrip;
            }
        } else {
            activeTrip = trip;
        }
    });
    if (req.query.inspiration) {
        var body = req.body;
        res.render('./flights/search', { user: req.user, activeTrip, origin: body.origin, destination: body.currentDestination});
    } else {
        res.render('./flights/search', { user: req.user, activeTrip, origin: null, destination: null });
    }
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

function getFlightData (req, res) {
    var body = req.body;
    var retDate;
    !body.returnDate ? retDate = '' : retDate = `&return_date=${body.returnDate}`;
    request(`https://api.sandbox.amadeus.com/v1.2/flights/low-fare-search?apikey=${process.env.AMADEUS_TOKEN}&origin=${body.origin}&destination=${body.destination}&departure_date=${body.departureDate}&adults=${body.adults}&number_of_results=20${retDate}`, (err, response, flights) => {
        var searchResults = JSON.parse(flights);
        res.json(searchResults).status(200);
    });
}

module.exports = {
    flightSearch,
    createFlights,
    getFlightData
}