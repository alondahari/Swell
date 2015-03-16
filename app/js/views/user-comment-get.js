define([
	'backbone',
	'jade',
	'text!templates/user-comment.jade'
], function(Backbone, jade, template){

	return Backbone.View.extend({

		template: jade.compile(template),

		initialize: function(){
			console.log(this.model)

		},

		render: function(){
			this.$el.html(this.template())
			if (!this.attributes.user.attributes._id){
				this.$('.user-comment').attr('disabled', true)
			} 
		}


	})

})