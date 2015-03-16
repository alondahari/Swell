define(['backbone', 'models/user-comment'], function(Backbone, userComment){

	return Backbone.Model.extend({
		idAttribute: '_id',
		model: 'userComment',
		url: backendPath + '/comments'
	})

})