define([
	'backbone',
	'jade',
	'text!templates/location-select.jade'
], function(Backbone, jade, template){
	'use strict'

	return Backbone.View.extend({

		template: jade.compile(template),

		events: {
			// 'change': 'spotChange'
		},

		initialize: function(){
			this.render()

		},

		render: function(){
			console.log(this.attributes);
			this.$el.html(this.template(this.attributes))
		},


	})

})