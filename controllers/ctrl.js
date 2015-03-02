var mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/swell')
var Spot = mongoose.model('locations', {
	continent: String,
	region: String,
	spot: String,
	lat: Number,
	lon: Number
})

var indexController = {
	getLocations: function(req, res) {
		Spot.find(function(err, spots){
			if (!err) {
				console.log(spots);
				res.send(spots)
			} else {
				console.log(err);
			}
		})
	}
};

module.exports = indexController;