define([
	'backbone',
	'jade',
	'text!templates/avatar.jade'
], function(Backbone, jade, template){

	return Backbone.View.extend({

		template: jade.compile(template),

		initialize: function(){

			this.render()

		},

		render: function(){
			this.$el.html(this.template({user: this.model.toJSON()}))
		},


	})

})