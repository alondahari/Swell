define([
	'backbone',
	'jade',
	'text!templates/user-profile.jade'
], function(Backbone, jade, template){

	return Backbone.View.extend({

		el: $('.wrapper'),

		template: jade.compile(template),

		initialize: function(){
			this.render()

		},

		render: function(){
			this.$el.html(this.template())
		},


	})

})