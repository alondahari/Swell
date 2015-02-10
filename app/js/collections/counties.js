define(['backbone', 'models/county'], function(Backbone, county){
	'use strict';
	
	var Counties = Backbone.Collection.extend({
		
		model: county

	});

	return Counties;
});