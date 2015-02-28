define([
	'backbone',
	'database',
	'models/user',
	'collections/users',
	'views/login',
	'views/location',
	'views/rate',
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
			'spot/:id': 'spot',
			'submit-rating': 'submitRating',
			'init-database': 'initDatabase'

		},

		login: function(){
			var users = new Users()
			return new Login({collection: users})
		},

		location: function(){			
		  var spots = new Spots()
		  return new LocationView({ collection: spots })
		},

		spot: function(id){
			var ratings = new Ratings()
			return new RateView({ collection: ratings, id: id})
		},

		/**
		 * helper to initiate a default database into localStorage
		 */
		initDatabase: function(){

			var hoodie = new Hoodie()
			hoodie.store.add('locations', Database.surfSpots).done(function(locs){
				hoodie.store.findAll('locations').publish()
			})

		}

	})

})