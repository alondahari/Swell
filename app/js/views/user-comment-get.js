define([
	'backbone',
	'jade',
	'text!templates/user-comment-get.jade'
], function(Backbone, jade, template){

	return Backbone.View.extend({

		template: jade.compile(template),

		events: {
			'click .del-button': 'deleteComment'
		},

		initialize: function(){
			this.render()
		},

		render: function(){
			this.$el.html(this.template({data: this.model}))
		},

		deleteComment: function(){
			var view = this

			// change to DELETE request
			$.get('/delete-comment/' + this.model.commentId, function () {
				console.log(arguments)
				view.remove()
			})
		}


	})

})