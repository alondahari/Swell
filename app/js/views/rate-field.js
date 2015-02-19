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
			'change': 'updateRatings'
		},

		initialize: function(){
			this.render()
			// hide defauld slider tooltip
			_.extend(this.attributes, {tooltip: 'hide'})
			this.slider = this.$el.find('.rating-input-range').slider(this.attributes)
			// update ratings to format wind - unnecessary if splitting rate and view
			this.updateRatings()
		},

		render: function(){
			this.$el.html(this.template(this.attributes))
		},

		updateRatings: function(){

			this.attributes.value = this.attributes.displayValue = this.slider.slider('getValue')
			console.log(this.slider.slider('getValue'));
			if (this.attributes.fieldName === 'wind') {
				this.attributes.displayValue = this.formatWindValue(this.slider.slider('getValue'))
			}

			this.$el.find('.rating-value').text(this.attributes.displayValue)
			this.attributes.changed = true
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