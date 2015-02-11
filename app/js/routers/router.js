define([
	'backbone',
	'views/location',
	'views/rate',
  'collections/spots'
  ], function(Backbone, LocationView, RateView, Spots){
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
			new RateView();
		}

	});

	return Router;

});