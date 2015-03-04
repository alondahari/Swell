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

		initialize: function(){
			this.render()

			if (this.attributes.fieldName === 'wind') {
				this.$el.find('.rating-value').text(this.formatWindValue(this.attributes.value))
			}
		},

		render: function(){
			this.$el.html(this.template(this.attributes))
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