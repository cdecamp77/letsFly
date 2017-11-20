var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
  name: {type: String, required: true},
  email: {type: String, required: true},
  avatar: {type: String, defualt: "https://i.imgur.com/4H32qle.jpg", required: true},
  trips: [{type: Schema.Types.ObjectId, ref: 'Trip'}],
  googleId: String,
  googleToken: String,
  },
  {
    timestamps: true
});

module.exports = mongoose.model('User', userSchema);