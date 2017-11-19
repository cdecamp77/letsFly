var Trip = require('../../models/trip');

function getAllTrips(req, res) {
    Trip.find({}, function(err, trips) {
        res.status(200).json(trips);
    });
}

function getOneTrip(req, res) {
    Trip.findById(req.params.id, function (err, trip){
        res.status(200).json(trip);
    });
}

module.exports = {
    getAllTrips,
    getOneTrip 
}