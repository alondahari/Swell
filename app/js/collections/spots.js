define([
	'backbone',
	'models/spot'
	], function(Backbone, spot){
	
	return Backbone.Collection.extend({
		
		model: spot,

		url: '/locations',

		initialize: function(){
			var collection = this
			this.fetch({success: function(collection){
				collection.trigger('fetched')
			}})

			navigator.geolocation.getCurrentPosition(function(pos){
				collection.trigger('geo', pos)
			})
		}

	})

})