define(['backbone'], function(Backbone){

	return Backbone.Model.extend({
		url: backendPath + '/rating',
		idAttribute: "_id",
		defaults: {
			value: 0
		}
	})

})