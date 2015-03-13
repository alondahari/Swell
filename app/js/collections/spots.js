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
			this.getUserLocation()
		},

		getUserLocation: function(){
			var collection = this
			navigator.geolocation.getCurrentPosition(function(pos){
				collection.trigger('geo', pos)
			}, function(err){
				collection.trigger('geoError', err)
				console.log(err)
			})
		},

	})

})