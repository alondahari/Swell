define([
	'backbone',
	'handlebars',
	'slider',
	'text!templates/rate-field.html'
], function(Backbone, handlebars, slider, template){
	'use strict';

	return Backbone.View.extend({

		className: 'row',

		template: handlebars.compile(template),

		events: {
			'change': 'updateRatings'
		},

		initialize: function(){
			this.render()
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

	});

});