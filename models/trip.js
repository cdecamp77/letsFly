var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Flight = require('./flight');

var tripSchema = new Schema ({
  departureCity: {type: String},
  arrivalCity: {type:String},
  departureDate: Date,
  returnDate: Date,
  travelers: {type: String},
  flights: [Flight],
  },
  {
    timestamps: true
  }
);

// virtual to calculate total trip cost (once hotel booking features are implemented this virtual will be updated)
tripSchema.virtual('totalTripCost').get(function() {
  return flights[0].itineraryPrice;
});

module.exports = mongoose.model('Trip', tripSchema);