var mongoose = require('mongoose')
var request = require('request')
var keys = require('../models/keys.js')

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
	time: Date,
	spotId: String
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
		var rating = new Rating(req.body)
		rating.save()
		
	},

	getMaps: function(req, res){
		request('https://maps.googleapis.com/maps/api/js?key=' + keys.googleMapsAPI, function(err, response, body){
				res.send(body)
		})
	}
};

module.exports = indexController;