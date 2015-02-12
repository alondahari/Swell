define([
	'backbone',
	'views/location',
	'views/rate',
  'collections/spots',
  'models/rating',
  'collections/ratings'
  ], function(Backbone, LocationView, RateView, Spots, Rating, Ratings){
	'use strict';

	var Router = Backbone.Router.extend({

		routes:{
			'': 'default',
			'spot/:id': 'spot',
			'submit-rating': 'submitRating'

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
		}

	});

	return Router;

});