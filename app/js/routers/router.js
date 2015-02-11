define(['backbone'], function(Backbone){
	'use strict';

	var Router = Backbone.Router.extend({

		routes:{

			'spot': 'spot'

		},

		spot: function(){
			// clear container
			// load in new view
		}

	});

	return Router;

});