define([
	'backbone',
	'views/location',
  'collections/spots'
  ], function(Backbone, Location, Spots){
	'use strict';

	var Router = Backbone.Router.extend({

		routes:{
			'': 'default',
			'spot': 'spot'

		},

		default: function(){
		  var spots = new Spots(JSON.parse(localStorage.surfSpots));
		  new Location({ model: spots });
		},

		spot: function(){
			// clear container
			// load in new view
		}

	});

	return Router;

});