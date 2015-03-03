var mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/swell')
var Spot = mongoose.model('locations', {
	continent: String,
	region: String,
	spot: String,
	lat: Number,
	lon: Number
})

var Rating = mongoose.model('ratings', {
	overall: Number,
	waveHeight: Number,
	wind: Number,
	crowd: Number,
	userId: Number,
	time: Date
})

var indexController = {
	getLocations: function(req, res) {
		Spot.find(function(err, spots){
			if (!err) {
				res.send(spots)
			} else {
				console.log(err);
			}
		})
	},

	setRating: function(req, res) {
		console.log(req.body);
		// var rating = new Rating()
		
	}
};

module.exports = indexController;