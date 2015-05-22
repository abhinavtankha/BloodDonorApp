// load the things we need
var mongoose = require('mongoose')
var Schema = mongoose.Schema;

// define the schema for our user location model
var bloodDonation = new Schema({
    donorId         : String,
    recipientId		: String,
    date            : Number,
    address         : String,
    bloodGroup      : String,
    units           : Number
});

bloodDonation.set('collection', 'bloodDonation');

module.exports = mongoose.model('bloodDonation', bloodDonation);

