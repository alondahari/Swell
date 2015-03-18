define(['backbone'], function(Backbone){

	return Backbone.Model.extend({
		url: '/user-setting',
		idAttribute: "_id"
	})

})