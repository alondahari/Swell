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

		ratings: {},

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
			this.collection.fetch();

			_.each(this.fields, function(val){
				// reset fields
				// get available averages
				val.value = this.ratings[val.id] = this.collection.getAverage(this.id, val.id);
			},this);

			this.listenTo(this.model, 'change', this.updateRatings);
			this.render();
		},

		render: function(){
			this.$el.html(this.template({header: this.id}));
			this.injectObject(this.fields, this.ratings);
			this.renderFields();
		},

		renderFields: function(){

			this.$el.find('.ratings').html(this.fieldTemplate({fields: this.fields}));
		},

		injectObject: function(arr, object){
			_.each(arr, function(val){
				val.value = object[val.id] || val.value || 0;
			},this);
		},

		updateModel: function(e){
			var target = $(e.target);
			var field = target.data('field');

			// set the field, silent to not trigger 'change' twice
			this.model.set(field, parseFloat(target.val()), {silent:true});
			this.model.set({time: Date.now(), spot_name: this.id});
		},

		updateRatings: function(){
			this.injectObject(this.fields, this.model.toJSON());
			this.renderFields();
		}


	});

});