define(['backbone', 'models/spot'], function(Backbone, spot){
	'use strict';
	
	var Spots = Backbone.Collection.extend({
		
		model: spot

	});

	return Spots;
});