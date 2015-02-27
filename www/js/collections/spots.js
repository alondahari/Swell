define([
	'backbone',
	'localStorage',
	'models/spot',
	'database'
	], function(Backbone, Store, spot, database){
	'use strict'
	
	return Backbone.Collection.extend({
		
		model: spot,

		localStorage: new Store('surfSpots'),

		initialize: function(){
			this.fetch()
		}

	})

})