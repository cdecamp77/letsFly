var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var tripSchema = new Schema ({
  departureCity: {type: String},
  arrivalCity: {type:String},
  adults: {type: String},
  active: {type: Boolean, default: true},
  booked: {type: Boolean, default: false},
  flights: [{type: Schema.Types.ObjectId, ref: 'Flight'}],
  hotels: [{type: Schema.Types.ObjectId, ref: 'Hotel'}]
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Trip', tripSchema);