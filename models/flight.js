var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var flightSchema = new Schema ({
  outbound: Boolean,
  origin: String,
  destination: String,
  departureTime: Date,
  arrivalTime: Date,
  airline: String,
  flightNumber: String,
  },
  {
    timestamps: true
  }
);

module.exports = flightSchema;