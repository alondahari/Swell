define(['backbone'], function(Backbone){

	return Backbone.Model.extend({
		url: '/ratings',
		idAttribute: "_id",
		defaults: {
			value: 0
		}
	})

})