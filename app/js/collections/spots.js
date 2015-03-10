define([
	'backbone',
	'models/spot'
	], function(Backbone, spot){
	'use strict'
	
	return Backbone.Collection.extend({
		
		model: spot,

		url: '/locations',

		initialize: function(){
			this.fetch({success: function(collection){
				collection.trigger('fetched')
			}})
		}

	})

})