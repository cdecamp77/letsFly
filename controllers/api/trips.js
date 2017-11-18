var Trip = require('../models/trip');

function index(req, res) {
    res.render('index');
    
}

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
    index,
    getAllTrips,
    getOneTrip 
}