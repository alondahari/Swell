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
		},

		render: function(){
			this.$el.html(this.template(this.attributes))
		},

		updateRatings: function(){
			this.attributes.value = this.slider.slider('getValue')
			this.$el.find('.rating-value').text(this.attributes.value)
			this.attributes.changed = true
		}

	})

})