define([
	'backbone',
	'jade',
	'slider',
	'text!templates/view-rating.jade'
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
			// hacky... bad...
			if (this.attributes.fieldName === 'wind') {
				this.attributes.value = this.formatWindValue(this.attributes.value)
				this.$el.find('.rating-value').text(this.attributes.value)
			}
		},

		render: function(){
			this.$el.html(this.template(this.attributes))
		},

		updateRatings: function(){
			var value = this.slider.slider('getValue')

			this.attributes.value = (this.attributes.fieldName === 'wind') ?
				this.formatWindValue(value) : value

			this.$el.find('.rating-value').text(this.attributes.value).addClass('value-changed')
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