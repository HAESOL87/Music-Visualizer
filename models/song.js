var mongoose = require('mongoose');

var SongSchema = new mongoose.Schema({
  title:  { type : String, required : true },
  artist: { type : String, required : true }
}, { timestamps: true } );

module.exports = mongoose.model('Song', SongSchema);
