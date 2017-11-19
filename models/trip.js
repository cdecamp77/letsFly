var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var tripSchema = new Schema ({
  departureCity: {type: String, required: true},
  arrivalCity: {type:String, required: true},
  travelers: {type: String, required: true, default: "1"},
  active: {type: Boolean, default: true},
  booked: {type: Boolean, defualt: false},
  flights: [{type: Schema.Types.ObjectId, ref: 'Flight'}],
  hotels: [{type: Schema.Types.ObjectId, ref: 'Hotel'}]
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Trip', tripSchema);