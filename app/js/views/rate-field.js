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
			this.slider = this.$el.find('.rating-input-range').slider(this.model.toJSON())

			if (this.model.attributes.fieldName === 'wind') {
				this.$el.find('.rating-value').text('None (0-3 knots)')
			}
		},

		render: function(){
			this.$el.html(this.template(this.model.toJSON()))
		},

		updateRatings: function(){


			// get value from slider
			var value = this.slider.slider('getValue')

			// format value if neede
			var text = (this.model.get('fieldName') === 'wind') ? this.formatWindValue(value) : value

			// set the value in the DOM and add class for visual change feedback
			this.$el.find('.rating-value').text(text).addClass('value-changed')

			// timeout to avoid multiple calls to the server on slider drag
			if (this.timeout) clearTimeout(this.timeout)
			this.timeout = setTimeout(function(view){
				view.timeout = null
				// update model and database
				view.model.save({time: Date.now(), spotId: this.id, value: value})
			}, 1000, this);

		},

		formatWindValue: function(val){
			var values = [
				'None (0-3 knots)',
				'Calm (4-9 knots)',
				'Strong (10-20 knots)',
				'High (20-40 knots)',
				'Stormy (40+ knots)'
			]
			return values[val]
		}

	})

})