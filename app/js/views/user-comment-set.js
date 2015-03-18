define([
	'backbone',
	'jade',
	'utils/pubsub',
	'text!templates/user-comment-set.jade'
], function(Backbone, jade, pubsub, template){

	return Backbone.View.extend({

		template: jade.compile(template),

		events: {
			'click': 'isLoggedIn',
			'keydown': 'commentChange',
			'blur .user-comment': 'saveComment'
		},

		initialize: function(){
			this.render()
		},

		render: function(){
			this.$el.html(this.template())
			if (!this.attributes.user.attributes._id){
				this.$('.user-comment').attr('disabled', true)
			} 
		},

		commentChange: function(e){
			if (e.which === 13 && !e.shiftKey) {
				e.preventDefault()
				$(e.target).blur()
			}
		},

		isLoggedIn: function(){
			if (!this.attributes.user.attributes._id){
				pubsub.trigger('pleaseLoginPulse')
				return false
			}
		},

		saveComment: function(e){
			var comment = $(e.target).val()
			var feedback = this.$('.comment-save')
			if (!comment) return
			feedback.text('Saving...')
			this.model.save({
				time: Date.now(),
				spotId: this.id,
				userId: this.attributes.user.attributes._id,
				comment: comment
			}, {success: function(model, data){

				feedback.text('Saved!')
			}, error: function(model, data){
				feedback.text('Error. Try again.')
				console.log('error: ', data)
			}})
		}


	})

})