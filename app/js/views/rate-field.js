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
			'change .rating-input-range': 'updateRatings'
		},

		initialize: function(){
			this.render()
			// hide defauld slider tooltip
			this.model.set({tooltip: 'hide'})
			this.slider = this.$el.find('.rating-input-range').slider(this.model.toJSON())
			// hacky... bad...
			if (this.model.attributes.fieldName === 'wind') {
				// this.model.set('value', this.formatWindValue(this.model.get('value')))
				this.$el.find('.rating-value').text('None (0-3 knots)')
			}
		},

		render: function(){
			this.$el.html(this.template(this.model.toJSON()))
		},

		updateRatings: function(e){
			var value = this.slider.slider('getValue')

			this.model.set('value', value)
			var text = (this.model.get('fieldName') === 'wind') ? this.formatWindValue(value) : value
			this.$el.find('.rating-value').text(text).addClass('value-changed')

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