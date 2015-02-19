define([
	'backbone',
	'handlebars',
	'text!templates/location-select.html'
], function(Backbone, handlebars, template){
	'use strict'

	return Backbone.View.extend({

		template: handlebars.compile(template),

		events: {
			// @refactor: combine into one event handler
			// @refactor: capitalize field categories
			'change .country-select': 'countryChange',
			'change .county-select': 'countyChange',
			'change .spot-select': 'spotChange'
		},

		initialize: function(){
			this.render()

		},

		render: function(){
			console.log(this.attributes)
			this.$el.html(this.template(this.attributes))
		},


	})

})