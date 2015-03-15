var mongoose = require('mongoose')
var request = require('request')
var db = require('../models/db.js')

var mapsAPI

mapsAPI = (process.env.NODE_ENV === 'development') ?
	require('../models/keys.js').googleMapsAPI :
	process.env.MAPS_API

var Spot = mongoose.model('locations', {
	continent: String,
	region: String,
	spot: String,
	lat: Number,
	lng: Number
})


/**
 * routes
 */

module.exports = {

	index: function(req, res){
		res.render('index')
	},

	seed: function(req, res){
		db.forEach(function(doc){
			var spot = new Spot(doc)
			spot.save()
		})
	},

	getLocations: function(req, res) {

		Spot.find(function(err, spots){
			if (!err) {
				res.send(spots)
			} else {
				console.log(err);
			}
		})
	},

	getMaps: function(req, res){
		request('https://maps.googleapis.com/maps/api/js?key=' + mapsAPI, function(err, response, body){
				res.send(body)

		})
	}
};