define([
	'backbone',
	'localStorage',
	'models/spot'
	], function(Backbone, Store, spot){
	'use strict'
	
	return Backbone.Collection.extend({
		
		model: spot,

		initialize: function(){
			var hoodie = new Hoodie()
			hoodie.store.findAll('locations').done(function(locations){
				this.set(locations)
			})
		}

	})

})