define([
	'backbone',
	'views/location',
	'views/rate',
  'collections/spots',
  'collections/ratings'
  ], function(Backbone, LocationView, RateView, Spots, Ratings){
	'use strict';

	var Router = Backbone.Router.extend({

		routes:{
			'': 'default',
			'spot/:id': 'spot'

		},

		default: function(){
		  var spots = new Spots(JSON.parse(localStorage.surfSpots));
		  new LocationView({ collection: spots });
		},

		spot: function(id){
			// must be a better way to do this!
			var ratings = new Ratings();
			new RateView({ model: ratings, id: id });
		}

	});

	return Router;

});