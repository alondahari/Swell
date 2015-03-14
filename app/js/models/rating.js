define(['backbone'], function(Backbone){

	return Backbone.Model.extend({
		url: '/rating',
		idAttribute: "_id",
		defaults: {
			value: 0
		}
	})

})