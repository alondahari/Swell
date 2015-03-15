define([
	'backbone',
	'jade',
	'text!templates/user-comment.jade',
	'models/user-comment'
], function(Backbone, jade, template, UserComment){

	return Backbone.View.extend({

		template: jade.compile(template),

		events: {
			'keydown': 'commentChange',
			'blur .user-comment': 'saveComment'
		},

		initialize: function(){
			this.render()
		},

		render: function(){
			
			this.$el.html(this.template())
		},

		commentChange: function(e){
			if (e.which === 13 && !e.shiftKey) {
				e.preventDefault()
				$(e.target).blur()
			}
		},

		saveComment: function(){
			console.log('test')	
		}


	})

})