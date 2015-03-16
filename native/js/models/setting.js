define(['backbone'], function(Backbone){

	return Backbone.Model.extend({
		url: backendPath + '/user-setting',
		idAttribute: "_id",
	})

})