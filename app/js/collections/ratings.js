define(['backbone', 'models/rating'], function(Backbone, rating){
	'use strict';
	
	return Backbone.Collection.extend({
		
		model: rating,

		ratings: function(){
			return JSON.parse(localStorage.ratings);
		},

		initialize: function(){
			this.on('add', this.addRating);
		},

		addRating: function(){
			localStorage.ratings = JSON.stringify(this.toJSON());
		},

		getAverage: function(field){

		}

	});
	
});