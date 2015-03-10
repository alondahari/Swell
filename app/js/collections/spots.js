define([
	'backbone',
	'models/spot'
	], function(Backbone, spot){
	
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