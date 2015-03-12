var app = require('../app.js')
var mongoose = require('mongoose')
var request = require('request')
var db = require('../models/db.js')

var passportLocalMongoose = require('passport-local-mongoose')
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

var Rating = mongoose.model('ratings', {
	fieldName: String,
	userId: Number,
	time: Number,
	spotId: String,
	value: Number
})

var validate = {
	email: /^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/,
	password: /^[\w\d!@#$%]{5,}$/
}

var validate = function(field, req, res){
	if (!req.body[field].match(validate[field])) {
		res.send('Invalid password or username')
	}
}


/**
 * routes
 */

var indexController = {

	index: function(req, res){
		res.render('index')
	},

	seed: function(req, res){
		db.forEach(function(doc){
			var spot = new Spot(doc)
			spot.save()
		})
	},

	passportLogin: function(req, res) {
		validate('username', req, res)
		validate('password', req, res)

		login(req, res)
	},

	passportSignup: function(req, res) {

		validate('username', req, res)
		validate('password', req, res)

		User.register(new User({ username : req.body.username }), req.body.password, function(err, account) {
			if (err) {
				return res.send("Username already exists")
			}

			login(req, res)
		});

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

	getRatings: function(req, res) {

		Rating.find({spotId: req.params.id}, function(err, ratings){
			if (!err) {
				res.send(ratings)
			} else {
				console.log(err);
			}
		})
	},

	setRating: function(req, res) {
		// only makes sense once I add users
		// 3600000 = a user can submit a new rating once an hour
		var recent = req.body.time - 3600000
		var query = {spotId: req.body.spotId, fieldName: req.body.fieldName, time: {$gt: recent}}
		Rating.remove(query, function(err){
			if (!err) {
				var rating = new Rating(req.body)
				rating.save(function(err, model){
					if (!err) {
						res.send(model)
						
					} else {
						res.send('error creating record:', err)
					}
				})
			} else {
				res.send('error removing record:', err)
			}
		})
		
	},

	getMaps: function(req, res){
		request('https://maps.googleapis.com/maps/api/js?key=' + mapsAPI, function(err, response, body){
				res.send(body)
		})
	}
};

module.exports = indexController;