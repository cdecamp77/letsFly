var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var tripSchema = new Schema ({
  departureCity: {type: String},
  arrivalCity: {type:String},
  travelers: {type: String, default: "1"},
  active: {type: Boolean, default: true},
  flights: [{type: Schema.Types.ObjectId, ref: 'Flight'}],
  hotels: [{type: Schema.Types.ObjectId, ref: 'Hotel'}]
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Trip', tripSchema);