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
			var ratings = new Ratings([
				{
					header: 'Overall Wave Quality',
					defaultValue: 4.2,
					max: 10,
					unit: '/ 10'
				},
				{
					header: 'Wave Height',
					defaultValue: 6.2,
					max: 12,
					unit: 'ft'
				},
				{
					header: 'Wind',
					defaultValue: 0,
					max: 5,
					unit: 'mph'
				},
				{
					header: 'Crowd',
					defaultValue: 200,
					max: 200,
					unit: 'surfers'
				}
			]);
			new RateView({ model: ratings, header: 'id' });
		}

	});

	return Router;

});