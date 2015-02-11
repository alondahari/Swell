define([
	'backbone',
	'views/location',
	'views/rate',
  'collections/spots',
  'models/rating'
  ], function(Backbone, LocationView, RateView, Spots, Rating){
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
			var rating = new Rating();
			new RateView({ model: rating, id: id });
		}

	});

	return Router;

});