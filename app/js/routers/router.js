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
		  var spots = new Spots(JSON.parse(localStorage.surfSpots));
		  new LocationView({ collection: spots });
		},

		spot: function(id){
			this.ratings = new Ratings(JSON.parse(localStorage.ratings));
			this.rating = new Rating();
			new RateView({ model: this.rating, id: id});
		},

		submitRating: function(){
			this.ratings.add(this.rating);
		}

	});

	return Router;

});