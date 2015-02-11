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
		  new LocationView({ model: spots });
		},

		spot: function(id){

			var ratings = new Ratings();
			new RateView();
		}

	});

	return Router;

});