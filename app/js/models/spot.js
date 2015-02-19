define(['backbone'], function(Backbone){
	'use strict'

	return Backbone.Model.extend({

		// mock having more than one country
		defaults: {
			country: 'California'
		}

	})

})