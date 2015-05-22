var donationDetailsSchema = require('./models/bloodDonations.js');

module.exports = function(app, passport){

	//construct query and get value of donation details from user userId
	app.get('/getDonationDetails', function(req, res){
		var id = req.query.id;
		donationDetailsSchema
			.find({ $or : [{donorId:id}, {recipient:id}]})
			.exec(function(req, res){
				var unitsDonated = 0,
					unitsReceived = 0;
				for(var i=0; i < res.length; i++){	
					if(res[i].donorId == id){
						unitsDonated += res[i].units;
					}
					else if(res[i].recipientId == id){
						unitsReceived += res[i].units;
					}
					console.log(res[i]);
				}
			})

	})
	

	//construct query and store value of donation details
	app.post('/storeDonationDetails', function(req, res){
		var donationDetails = new donationDetailsSchema();
		donationDetails.donorId = req.body.donorId;
		donationDetails.recipientId = req.body.recipientId;
		donationDetails.date = req.body.date;
		donationDetails.address = req.body.address;
		donationDetails.bloodGroup = req.body.bloodGroup; // whether to keep verification for blood group entered
		donationDetails.units = req.body.units;

		donationDetails.save(function(err){
			if(err){
				res.send(err);
				console.log("Failure to Store Donation Details " + err);
			}
			res.json({'success' : true});
		});

	})


}