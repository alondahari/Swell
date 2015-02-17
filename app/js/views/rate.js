define([
	'backbone',
	'handlebars',
	'text!templates/rate.html',
	'text!templates/rate-field.html'
], function(Backbone, handlebars, template, fieldTemplate){
	'use strict';

	return Backbone.View.extend({

		el: $('.wrapper'),

		template: handlebars.compile(template),
		fieldTemplate: handlebars.compile(fieldTemplate),

		ratings: {},
		newRating: {},

		fields: [
			{
				header: 'Overall Wave Quality',
				max: 10,
				unit: '/ 10',
				id: 'overall',
				value: 0
			},
			{
				header: 'Wave Height',
				max: 12,
				unit: 'ft',
				id: 'waveHeight',
				value: 0
			},
			{
				header: 'Wind',
				max: 5,
				unit: 'mph',
				id: 'wind',
				value: 0
			},
			{
				header: 'Crowd',
				max: 200,
				unit: 'surfers',
				id: 'crowd',
				value: 0
			}
		],


		events: {
			'change .rating-input-range': 'updateRatings',
			'click .button-submit': 'submit'
		},

		initialize: function(){
			this.getAverages();
			// this.listenTo(this.collection, 'change', this.updateRatings);
			this.injectObject(this.fields, this.ratings);
			this.render();
			
		},

		render: function(){
			this.$el.html(this.template({header: this.id}));
			this.renderFields();
		},

		/**
		 * render the rating fields with a different template
		 * refactor: make into a seperate view
		 */
		renderFields: function(){
			this.$el.find('.ratings').html(this.fieldTemplate({fields: this.fields}));
		},

		/**
		 * reset fields, get available averages
		 */
		getAverages: function(){
			_.each(this.fields, function(val){
				val.value = this.ratings[val.id] = this.collection.getAverage(this.id, val.id);
			},this);
		},

		/**
		 * Helper function to add an object to an array
		 * used to insert ratings into their respective fields
		 */
		injectObject: function(arr, object){
			_.each(arr, function(val){
				val.value = object[val.id] !== undefined ? object[val.id] : val.value || 0;
			},this);
		},

		/**
		 * update model on slider change
		 * @param  {event}
		 */
		updateModel: function(e){

		},

		/**
		 * update the sliders view when the model updates
		 */
		updateRatings: function(e){
			var target = $(e.target);
			var field = target.data('field');

			this.newRating = {time: Date.now(), spot_name: this.id};
			// set the field, silent to not trigger 'change' twice
			this.newRating[field] = parseFloat(target.val());

			this.injectObject(this.fields, this.newRating);
			this.renderFields();
		},

		submit: function(){
			this.collection.create(this.newRating);
		}


	});

});