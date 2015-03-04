define(['backbone'], function(Backbone){
	'use strict'

	return Backbone.Model.extend({
		url: '/ratings',
		defaults: {
			value: 0
		}
	})

})