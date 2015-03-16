define([
	'backbone',
	'jade',
	'text!templates/user-comment-get.jade'
], function(Backbone, jade, template){

	return Backbone.View.extend({

		template: jade.compile(template),

		initialize: function(){
			console.log(this.model)
			this.render()
		},

		render: function(){
			this.$el.html(this.template({data: this.model}))
		}


	})

})