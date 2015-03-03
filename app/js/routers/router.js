define([
	'backbone',
	'database',
	'models/user',
	'collections/users',
	'views/login',
	'views/location',
	'views/rate',
	'views/spot',
  'collections/spots',
  'models/rating',
  'collections/ratings'
  ], function(
  	Backbone,
  	Database,
  	User,
  	Users,
  	Login,
  	LocationView,
  	RateView,
  	SpotView,
  	Spots,
  	Rating,
  	Ratings
  ){
	'use strict'

	return Backbone.Router.extend({

		routes:{
			'': 'login',
			'location': 'location',
			'spot/:title/:id': 'rate',
			'view-spot/:title/:id': 'viewSpot',
			'submit-rating': 'submitRating',
			'init-database': 'initDatabase'
		},

		login: function(){
			var users = new Users()
			return new Login({collection: users})
		},

		location: function(){			
		  var spots = new Spots()
		  spots.fetch({success: function(){
		  	new LocationView({ collection: spots })
			}})
		},

		rate: function(title, id){
			var rating = new Rating()
			return new RateView({ model: rating, id: id, attributes: {title: title}})
		},

		viewSpot: function(title, id){
			var ratings = new Ratings()
			return new SpotView({ collection: ratings, id: id, attributes: {title: title}})
		},

		/**
		 * helper to initiate a default database into localStorage
		 */
		initDatabase: function(){


		}

	})

})