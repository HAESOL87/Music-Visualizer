var express = require('express');
var router = express.Router();

var Song = require('../models/song');

function seedSongs(){
  var songs = [
    {title : "Run",              artist : "Alison Wonderland", filename : "Run - Alison Wonderland.mp3"},
    {title : "Above The Middle", artist : "Odesza", filename : "Above The Middle - Odesza.mp3"},
    {title : "Go With It",       artist : "TokiMonsta", filename : "Go With It - TOKiMONSTA.mp3"},
    {title : "Notorious",        artist : "Malaa", filename : "Malaa - Notorious.mp3"},
    {title : "White Iverson (Malaa Remix)",       artist : "Post Malone", filename : "Post Malone - White Iverson (Malaa Remix).mp3"},
    {title : "Lean On (Malaa Remix)",       artist : "Major Lazer & DJ Snake", filename : "Major Lazer & DJ Snake (Feat. MØ) - Lean On (Malaa Remix).mp3"},
    {title : "Drop Girl (Malaa Remix)",       artist : "Ice Cube", filename : "Ice Cube  - Drop Girl (Malaa Remix).mp3"},
    {title : "Pregnant",         artist : "Malaa", filename : "Malaa - Pregnant.mp3"},

  ];

  Song.find({}).remove()
  .then(function() {
    return Song.create(songs);
  })
  .then(function() {
    return Song.find({});
  })
  .then(function(found) {
    console.log("We saved and retrieved", found.length, 'songs.');
  });
}

seedSongs();


/* GET home page. */
router.get('/', function(req, res, next) {
  Song.find({})
  .then(function(songs){
    res.json(songs);
  });
});

router.get('/:id', function(req, res, next){
  Song.findById(req.params.id)
  .then(function(song) {
    // if (!song) {
    //   res.status(404).json ( { error: 'Not found' } );
    // }
    res.json(song);
  })
  .catch(function(err){
    return next(err);
  });
});

module.exports = router;
