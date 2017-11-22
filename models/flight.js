var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var flightSchema = new Schema ({
  outbound: {type: Boolean, default: null, required: true},
  origin: {type: String, required: true},
  destination: {type:String, required: true},
  departureTime: Date,
  arrivalTime: Date,
  marketingAirline: String,
  flightNumber: String,
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Flight', flightSchema);