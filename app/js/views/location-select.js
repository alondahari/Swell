define([
	'backbone',
	'jade',
	'text!templates/location-select.jade'
], function(Backbone, jade, template){
	'use strict'

	return Backbone.View.extend({

		template: jade.compile(template),

		initialize: function(){
			this.render()

		},

		render: function(){
			this.$el.html(this.template(this.attributes))
		},


	})

})