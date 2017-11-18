var Trip = require('../models/trip');

function index(req, res) {
    res.render('index');
    
}

module.exports = {
    index
}