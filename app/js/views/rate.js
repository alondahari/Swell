define([
	'backbone',
	'text!templates/rate.html',
], function(Backbone, template){
	'use strict';

	return Backbone.View.extend({

		el: $('.container'),

		template: _.template(template),

		events: {

		},

		initialize: function(){
			this.render();
		},

		render: function(){
			this.$el.html(this.template());
		}


	});

});