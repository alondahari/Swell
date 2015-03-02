define([
	'backbone',
	'localStorage',
	'models/spot'
	], function(Backbone, Store, spot){
	'use strict'
	
	return Backbone.Collection.extend({
		
		model: spot,
		url: '/locations',
		// localStorage: new Store('ratings'),

		initialize: function(){
			
		}

	})

})