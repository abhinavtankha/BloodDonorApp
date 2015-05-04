// load the things we need
var mongoose = require('mongoose')
var Schema = mongoose.Schema;

// define the schema for our user location model
var userLocation = new Schema({

    userId         : String,
    geoLocation    : {type : [Number], index :     '2d'},
    lastUpdatedTime: Number,
    timingPreference: String, // to be changed
    bloodGroup: String
});

userLocation.set('collection', 'userlocation');

module.exports = mongoose.model('userLocation', userLocation);

