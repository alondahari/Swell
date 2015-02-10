define([
	'backbone',
	'text!templates/location.html'
], function(Backbone, template){
	'use strict';

	var SearchBarView = Backbone.View.extend({
		tagName: 'input',

		template: _.template(template),

		initialize: function(){
			this.render();
		},

		render: function(){
			var counties = _.unique(this.model.pluck('county_name'));
			$('body').append(this.template({counties: counties}));
		}


	});
	return SearchBarView;
});