define([
	'backbone',
	'handlebars',
	'text!templates/location-select.html'
], function(Backbone, handlebars, template){
	'use strict'

	return Backbone.View.extend({

		template: handlebars.compile(template),

		events: {
			// 'change': 'spotChange'
		},

		initialize: function(){
			this.render()

		},

		render: function(){
			this.$el.html(this.template(this.attributes))
		},


	})

})