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
			new RateView({ model: this.rating, id: id});
		},

		submitRating: function(){
			// avoid error if url was manually entered or page reloaded
			if (this.rating) {
				this.ratings = new Ratings();
				this.ratings.add(this.rating);				
			}

			this.default();
		},

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