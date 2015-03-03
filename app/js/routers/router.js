define([
	'backbone',
	'database',
	'models/user',
	'collections/users',
	'views/login',
	'views/location',
	'views/rate',
	'views/spot',
	'models/spot',
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
  	Spot,
  	Spots,
  	Rating,
  	Ratings
  ){
	'use strict'

	return Backbone.Router.extend({

		routes:{
			'': 'login',
			'location': 'location',
			'spot/:id': 'rate',
			'view-spot/:id': 'viewSpot',
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

		rate: function(id){
			var ratings = new Ratings()
			return new RateView({ collection: ratings, id: id})
		},

		viewSpot: function(id){
			var ratings = new Ratings()
			return new SpotView({ collection: ratings, id: id})
		},

		/**
		 * helper to initiate a default database into localStorage
		 */
		initDatabase: function(){


		}

	})

})