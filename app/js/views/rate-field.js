define([
	'backbone',
	'jade',
	'slider',
	'text!templates/rate-field.jade'
], function(Backbone, jade, slider, template){
	'use strict'

	return Backbone.View.extend({

		className: 'row',

		template: jade.compile(template),

		events: {
			'change .rating-input-range': 'updateRatings',
			'click .slider': 'updateRatings'
		},

		initialize: function(){
			this.render()
			// hide defauld slider tooltip
			this.model.set({tooltip: 'hide'})
			this.slider = this.$('.rating-input-range').slider(this.model.toJSON())
			var value = this.slider.slider('getValue')
			var text = this.formatText(this.model.get('fieldName'), value)

				this.$('.rating-value').text(text)
		},

		render: function(){
			this.$el.html(this.template(this.model.toJSON()))
		},

		updateRatings: function(){


			// get value from slider
			var value = this.slider.slider('getValue')

			// format value if neede
			var text = this.formatText(this.model.get('fieldName'), value)

			// set the value in the DOM and add class for visual change feedback
			this.$('.rating-value').text(text).addClass('value-changed')

			// timeout to avoid multiple calls to the server on slider drag
			if (this.timeout) clearTimeout(this.timeout)
			
			this.$('.rating-save').text('Saving...')

			this.timeout = setTimeout(function(view){
				view.timeout = null
				// update model and database
				view.model.save({time: Date.now(), spotId: view.id, value: value}, {success: function(model, data){

					view.$('.rating-save').text('Saved!')

				}, error: function(model, data){
					console.log('error: ', data)
				}})
			}, 1000, this);

		},

		formatText: function(field, val){
			console.log(field)
			var formats = {
				wind: [
					'None (0-3 knots)',
					'Calm (4-9 knots)',
					'Strong (10-20 knots)',
					'High (20-40 knots)',
					'Stormy (40+ knots)'
				],
				measurement: [
					'Imperial',
					'Metric'
				]
				
			}
			return formats[field] ? formats[field][val] : val
		},

		formatMeasurements: function(val){
		}

	})

})