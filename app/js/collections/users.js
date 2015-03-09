define([
	'backbone',
	'models/user',
	], function(Backbone, user){
	
	return Backbone.Collection.extend({
		
		model: user,

		initialize: function(){

		}

	})

})