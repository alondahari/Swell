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
			this.listenTo(this.collection, 'change', this.updateRatings);
			this.render();
		},

		render: function(){
			this.$el.html(this.template({header: this.id}));
			this.renderFields();
		},

		renderFields: function(){
			this.collection.fetch();

			_.each(this.fields, function(val){
				val.value = this.collection.getAverage(this.id, val.id);
			},this);

			this.$el.find('.ratings').html(this.fieldTemplate({fields: this.fields}));
		},

		updateModel: function(e){
			var target = $(e.target);
			var field = target.data('field');

			this.model.set(field, parseFloat(target.val()));
			this.model.set('time', Date.now());
		},

		updateRatings: function(){
			_.extend(this.ratings, this.collection.toJSON());
			this.renderFields();
		}


	});

});