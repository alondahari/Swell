define([
	'backbone',
	'handlebars',
	'text!templates/rate.html',
	'text!templates/rate-field.html'
], function(Backbone, handlebars, template, fieldTemplate){
	'use strict';

	return Backbone.View.extend({

		el: $('.container'),

		template: handlebars.compile(template),
		fieldTemplate: handlebars.compile(fieldTemplate),

		// set defaults, dynamic in future
		ratings:{
			overall: 4,
			waveHeight: 6,
			wind: 0,
			crowd: 200
		},

		fields: [
			{
				header: 'Overall Wave Quality',
				max: 10,
				unit: '/ 10',
				id: 'overall'

			},
			{
				header: 'Wave Height',
				max: 12,
				unit: 'ft',
				id: 'waveHeight'
			},
			{
				header: 'Wind',
				max: 5,
				unit: 'mph',
				id: 'wind'
			},
			{
				header: 'Crowd',
				max: 200,
				unit: 'surfers',
				id: 'crowd'
			}
		],

		events: {
			'change .rating-input-range': 'updateModel'
		},

		initialize: function(){
			this.listenTo(this.model, 'change', this.updateRatings);
			this.render();
		},

		render: function(){
			this.$el.html(this.template({header: this.id}));
			this.renderFields();
		},

		renderFields: function(){
			this.injectObject(this.fields, this.ratings);
			this.$el.find('.ratings').html(this.fieldTemplate({fields: this.fields}));
		},

		// inject the ratings object into the fields array for tamplating
		injectObject: function(arr, object){
			_.each(arr, function(val){
				val.value = object[val.id];
			},this);
		},

		updateModel: function(e){
			var target = $(e.target);
			var field = target.data('field');
			this.model.set(field, parseFloat(target.val()));
		},

		updateRatings: function(){
			_.extend(this.ratings, this.model.toJSON());
			this.renderFields();
		}


	});

});