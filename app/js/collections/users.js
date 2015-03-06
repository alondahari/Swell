define([
	'backbone',
	'models/user',
	'database'
	], function(Backbone, user, database){
	
	return Backbone.Collection.extend({
		
		model: user,

		initialize: function(){
			// this.fetch()
		}

	})

})