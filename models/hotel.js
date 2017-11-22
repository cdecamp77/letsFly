var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var hotelSchema = new Schema ({
  propertyCode: {type: String, required: true},
  propertyName: {type: String, required: true},
  location: {
    latitude: Number,
    longitude: Number
  },
  address: {
    line1: String,
    city: String,
    zipCode: String,
    country: String
  },
  totalPrice: Number
  },
  {
    timestamps: true
  }
);

module.exports = hotelSchema;