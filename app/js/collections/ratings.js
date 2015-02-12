define(['backbone', 'models/rating'], function(Backbone, rating){
	'use strict';
	
	return Backbone.Collection.extend({
		
		model: rating,

		initialize: function(){
			this.on('add', this.addRating);
		},

		addRating: function(){
			localStorage.ratings = JSON.stringify(this.toJSON());
		}

	});
	
});