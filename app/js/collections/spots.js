define(['backbone', 'models/spot'], function(Backbone, spot){
	'use strict';
	
	return Backbone.Collection.extend({
		
		model: spot,

		getSpots: function(){
			return JSON.parse(localStorage.surfSpots);
		},

		initialize: function(){
			this.models = this.getSpots();
		},

	});

});