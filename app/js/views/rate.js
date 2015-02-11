define([
	'backbone',
	'text!templates/rate.html',
	'text!templates/rate-field.html'
], function(Backbone, template, fieldTemplate){
	'use strict';

	return Backbone.View.extend({

		el: $('.container'),

		template: _.template(template),
		fieldTemplate: _.template(fieldTemplate),

		fields: [
			{
				header: 'Overall Wave Quality',
				value: 4.2,
				max: 10,
				unit: '/ 10'
			},
			{
				header: 'Wave Height',
				value: 6.2,
				max: 12,
				unit: 'ft'
			},
			{
				header: 'Wind',
				value: 0,
				max: 5,
				unit: 'mph'
			},
			{
				header: 'Crowd',
				value: 200,
				max: 200,
				unit: 'surfers'
			}
		],

		events: {
			'change .rating-input-range': 'updateFieldValue'
		},

		initialize: function(){
			this.render();
		},

		render: function(){
			this.$el.html(this.template({header: this.id}));
			this.renderFields();
		},

		renderFields: function(){
			_.each(this.fields, function(val){
				this.$el.find('.ratings').append(this.fieldTemplate(val));
			}, this);
		},

		updateFieldValue: function(e){
			// this.model.
			console.log($(e.currentTarget));
		}


	});

});