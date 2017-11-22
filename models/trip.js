var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Flight = require('./flight');
var Hotel = require('./hotel');

var tripSchema = new Schema ({
  departureCity: {type: String},
  arrivalCity: {type:String},
  adults: {type: String},
  flightsCost: String,
  flights: [Flight],
  hotels: [Hotel]
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Trip', tripSchema);