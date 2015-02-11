define([
	'backbone',
	'text!templates/rate.html',
	'text!templates/rate-field.html',
], function(Backbone, template, fieldTemplate){
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
			// this.$el.find('.ratings').html()
			console.log(this.header);
		}


	});

});