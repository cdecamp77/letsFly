var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Flight = require('./flight');
var Hotel = require('./hotel');

var tripSchema = new Schema ({
  departureCity: {type: String},
  arrivalCity: {type:String},
  departureDate: Date,
  returnDate: Date,
  travelers: {type: String},
  flightCost: String,
  hotelCost: String,
  flights: [Flight],
  hotels: [Hotel]
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Trip', tripSchema);