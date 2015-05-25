
var userLocationSchema = require('./models/userLocation.js');
var bloodTypes = require('./models/mappings/bloodTypes');

//user passport access to get access to these app endpoints
module.exports = function(app, passport){

// This needs to be an update operation, if its there then update or else create a new row in mongo
	app.post('/storeUserLocation', function(req, res) {
		var userLocation = new userLocationSchema();
		userLocation.userId =   req.body.id;
		userLocation.geoLocation = [req.body.lat, req.body.lon]
		userLocation.lastUpdatedTime = (new Date).getTime();
		userLocation.timingPreference = req.body.timingPreference;
		userLocation.bloodGroup = req.body.bloodGroup;
		userLocation.save(function(err){
			if(err){
				res.send(err);
				console.log("failure in addition of record " + err);
			}
			res.json({'success' : true});
		})
	});

// NOTE: keep combinations for blood groups covering which all blood groups
	app.get('/getUsersNear', function(req, res){
		console.log(req.query.bloodGroup);
		var eligibleBloodDonors = bloodTypes.recipientMapping[req.query.bloodGroup]; // if no match is found undefined is set and all matches are given in qiery response
		var query = userLocationSchema.find({
				'geoLocation' : {
					$near : [
						req.query.lat,
						req.query.lon],
					$maxDistance: req.query.distance	
				},
				bloodGroup: eligibleBloodDonors

				});
			console.log(req.query.bloodGroup);
			query.exec(function(err, userLocations){

				if(err){
					console.log("Error in getting user around location" + err);
				}

				else{
					console.log("Found Users");
					res.json(userLocations);
				}
		});

	});

	app.get('/getUserLocation', function(req, res){
		userLocationSchema.findOne({userId:req.query.id},function(err, result){
			if(err){
				console.log("Error in getting User Location");
			}
			else{
				if(result){
					res.send({
						'geoLocation' : result.geoLocation,
						'userId' : result.userId,
						'bloodGroup' : result.bloodGroup || bloodTypes.AllBloodTypes
					});
				}
			}
		});


	});


	// route middleware to ensure user is logged in
	function isLoggedIn(req, res, next) {
	if (req.isAuthenticated())
		return next();

		res.send({"success": false,"reason":"Authentication Failure"});
}

}