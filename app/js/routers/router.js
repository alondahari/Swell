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
	'use strict';

	return Backbone.Router.extend({

		routes:{
			'': 'login',
			'location': 'location',
			'spot/:id': 'spot',
			'submit-rating': 'submitRating',
			'init-database': 'initDatabase'

		},

		login: function(){
			var users = new Users();
			return new Login({collection: users});
		},

		location: function(){			
		  var spots = new Spots();
		  new LocationView({ collection: spots });
		},

		spot: function(id){
			this.ratings = new Ratings();
			this.rating = new Rating();
			new RateView({ model: this.rating, collection: this.ratings, id: id});
		},

		/**
		 * submit ratings and return to home screen
		 */
		submitRating: function(){
			// avoid error if url was manually entered or page reloaded
			if (this.rating) {
				this.ratings.create(this.rating);
			}

			this.location();
		},

		/**
		 * helper to initiate a default database into localStorage
		 */
		initDatabase: function(){
			var spots = new Spots();
			spots.fetch();

			_.each(Database.surfSpots, function(val){
				// create a new model and save it to localStorage
				spots.create(val);
			});

		}

	});

});