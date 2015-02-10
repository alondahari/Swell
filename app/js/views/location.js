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
			$('body').append(this.template({collection: [{name: 'alon'}, {name:'mike'}]}));
		}


	});

	return SearchBarView;
});