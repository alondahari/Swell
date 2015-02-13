define([
	'backbone',
	'database',
	'views/location',
	'views/rate',
	'models/spot',
  'collections/spots',
  'models/rating',
  'collections/ratings'
  ], function(
  	Backbone,
  	Database,
  	LocationView,
  	RateView,
  	Spot,
  	Spots,
  	Rating,
  	Ratings
  ){
	'use strict';

	var Router = Backbone.Router.extend({

		routes:{
			'': 'default',
			'spot/:id': 'spot',
			'submit-rating': 'submitRating',
			'init-database': 'initDatabase'

		},

		default: function(){
		  var spots = new Spots();
		  new LocationView({ collection: spots });
		},

		spot: function(id){
			this.rating = new Rating();
			this.ratings = new Ratings();
			// console.log(this.ratings.localStorage.update);
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

			this.default();
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

	return Router;

});