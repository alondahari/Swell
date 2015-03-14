define([
	'backbone',
	'models/rating',
	'moment'
	], function(Backbone, rating, moment){
	
	return Backbone.Collection.extend({
		
		model: rating,
		url: '/locations'

	})
	
})