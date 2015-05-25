// TODO add the name of the donor/requester in response
var donationDetailsSchema = require('./models/bloodDonations.js');

module.exports = function(app, passport){

	/*
	* Get Donation Details for a User
	*/
	app.get('/getDonationDetails', function(req, res){
		var id = req.query.id;
		console.log('outside find');
		var userDonationDetails = {donation_list: [],
									units_donated: 0,
									units_received:0};
		donationDetailsSchema
			.find({ $or : [{donorId:id}, {recipient:id}]})
			.exec(function(request, response){
				var unitsDonated = 0,
					unitsReceived = 0;
				for(var i=0; i < response.length; i++){	
					if(response[i].donorId == id){
						console.log('inside donor');
						unitsDonated += response[i].units;
						userDonationDetails.donation_list.push({"user_id" : response[i].recipientId,
							"name": null, "units": "-"+response[i].units, "date": response[i].date});
						console.log(userDonationDetails.donation_list);
					}
					else if(response[i].recipientId == id){
						console.log('inside recipient');
						unitsReceived += response[i].units;
						userDonationDetails.donation_list.push({"user_id" : response[i].donorId,
							"name": null, "units": "+"+response[i].units, "date": response[i].date});
					}
				}
				userDonationDetails.units_donated = unitsDonated;
				userDonationDetails.units_received = unitsReceived;
				res.send(userDonationDetails);
			});
			
	});	

	/*
	* Store the Donation Details of a donation
	*/
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