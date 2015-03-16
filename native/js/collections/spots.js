define([
	'backbone',
	'models/spot'
	], function(Backbone, spot){
	
	return Backbone.Collection.extend({
		
		model: spot,

		url: backendPath + '/locations',

		initialize: function(){

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