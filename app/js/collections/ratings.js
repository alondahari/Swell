define(['backbone', 'models/rating'], function(Backbone, rating){
	'use strict';
	
	return Backbone.Collection.extend({
		
		model: rating

	});
	
});