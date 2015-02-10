define(['backbone'], function(Backbone){
	'use strict';

	var Spot = Backbone.Model.extend({

		// mock having more than one country
		defaults: {
			country: 'California'
		}

	});

	return Spot;
});