define([
	'backbone',
	'jade',
	'text!templates/rate.jade',
	'views/rate-field',
	'models/rating'
], function(Backbone, jade, template, RateField, Rating){
	'use strict'

	return Backbone.View.extend({

		template: jade.compile(template),

		newRating: {},

		fields: {
			overall: {
				header: 'Overall Wave Quality',
				max: 10,
				unit: '/ 10',
				fieldName: 'overall',
				value: 0
			},
			waveHeight: {
				header: 'Wave Height',
				max: 12,
				unit: 'ft',
				fieldName: 'waveHeight',
				value: 0
			},
			wind: {
				header: 'Wind',
				max: 4,
				fieldName: 'wind',
				value: 0
			},
			crowd: {
				header: 'Crowd',
				max: 200,
				unit: 'surfers',
				fieldName: 'crowd',
				value: 0
			}
		},

		// events: {
		// 	'click .button-submit': 'submit'
		// },

		initialize: function(){
			this.render()
			this.$el.find('a.rate-nav').attr('href', '#view-spot/' + this.attributes.title + '/' + this.id)
		},

		render: function(){
			this.$el.html(this.template({header: this.attributes.title}))
			// not setting .wrapper as $el to keep all events within scope
			$('.wrapper').html(this.el)
			this.renderFields()
		},

		/**
		 * render the rating fields with a different template
		 */
		renderFields: function(){
			_.each(this.fields, function(field){
				var rateField = new RateField({model: new Rating(field)})
				this.$el.find('.ratings').append(rateField.$el)
			}, this)
		},

		// // hacky... bad...
		// decypherWindValue: function(val){
		// 	var values = [
		// 		'None (0-3 knots)',
		// 		'Calm (4-9 knots)',
		// 		'Strong (10-20 knots)',
		// 		'High (20-40 knots)',
		// 		'Stormy (40+ knots)'
		// 	]
		// 	return _.indexOf(values, val)
		// },

		// submit: function(){

		// 	this.model.set({time: Date.now(), spotId: this.id})
		// 	_.each(this.rateFields, function(field){
		// 		if (field.attributes.fieldName === 'wind') {
		// 			field.attributes.value = this.decypherWindValue(field.attributes.value)
		// 		}
		// 		if (field.attributes.changed === true){
		// 			this.model.attributes[field.attributes.fieldName] = field.attributes.value
		// 		}
		// 	},this)

		// 	this.model.save({success: function(model, data){
		// 		console.log(data);
		// 	}, error: function(model, err){
		// 		console.log('error:', err.responseText);
		// 	}})

		// }


	})

})