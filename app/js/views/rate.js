define([
	'backbone',
	'text!templates/rate.html',
	'text!templates/rate-field.html',
], function(Backbone, template, fieldTemplate){
	'use strict';

	return Backbone.View.extend({

		el: $('.container'),

		template: _.template(template),

		fields: [
			{
				header: 'Overall Wave Quality',
				defaultValue: 4.2,
				max: 10,
				unit: '/ 10'
			},
			{
				header: 'Wave Height',
				defaultValue: 6.2,
				max: 12,
				unit: 'ft'
			},
			{
				header: 'Wind',
				defaultValue: 0,
				max: 5,
				unit: 'mph'
			},
			{
				header: 'Crowd',
				defaultValue: 200,
				max: 200,
				unit: 'surfers'
			}
		],

		events: {

		},

		initialize: function(){
			this.render();
		},

		render: function(){
			this.$el.html(this.template());
			// this.$el.find('.ratings').html()
			console.log(this.id);
		}


	});

});