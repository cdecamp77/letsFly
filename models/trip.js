var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var tripSchema = new Schema ({

  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Trip', tripSchema);