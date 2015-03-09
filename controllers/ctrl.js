var app = require('../app.js')
var mongoose = require('mongoose')
var request = require('request')
var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy

var passportLocalMongoose = require('passport-local-mongoose')
console.log(process.env.NODE_ENV)

if (process.env.NODE_ENV) {
	mongoose.connect(process.env.MONGOLAB_URI)
} else {
	var keys = require('../models/keys.js')
	mongoose.connect('mongodb://localhost/swell')
}

var Spot = mongoose.model('locations', {
	continent: String,
	region: String,
	spot: String,
	lat: Number,
	lon: Number
})

var Rating = mongoose.model('ratings', {
	fieldName: String,
	userId: Number,
	time: Number,
	spotId: String,
	value: Number
})


var User = new mongoose.Schema({
	userId: Number,
	username: String,
	password: String
})

User.plugin(passportLocalMongoose)

User = mongoose.model('users', User)

passport.use(new LocalStrategy(User.authenticate()))

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

var validate = {
	email: /^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/,
	password: /^[\w\d!@#$%]{5,}$/
}

var validate = function(field, req, res){
	if (!req.body[field].match(validate[field])) {
		res.send('Invalid password or username')
	}
}

var login = function(req, res){
	passport.authenticate('local', function(err, user, info){
		if (err || !user) {
			return res.send('Wrong password or username')
		}
		req.logIn(user, function(err){
			if (err) {
				console.log(err)
			} else {
				res.send(user)
			}
		})
	})(req, res)
};

var indexController = {
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
		request('https://maps.googleapis.com/maps/api/js?key=' + process.env.MAPS_API, function(err, response, body){
				res.send(body)
		})
	}
};

module.exports = indexController;