define([
	'backbone',
	'localStorage',
	'models/user',
	'database'
	], function(Backbone, Store, user, database){
	'use strict';
	
	return Backbone.Collection.extend({
		
		model: user,

		localStorage: new Store('users'),

		initialize: function(){
			this.fetch();
		}

	});

});