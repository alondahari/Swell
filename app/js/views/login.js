define([
	'backbone',
	'jade',
	'text!templates/login.jade',
], function(Backbone, jade, template){

	

	return Backbone.View.extend({

		el: '.wrapper',

		template: jade.compile(template),

		initialize: function(){
			
			this.listenTo(this.model, 'invalid', this.highlightError)
			this.listenTo(this.model, 'change', this.setValid)
			this.listenTo(this.model, 'sync', this.loginSuccess)
			this.listenTo(this.model, 'error', this.loginError)
			this.render()
		},

		render: function(){
			$('.loading-spinner').hide()
			this.$el.html(this.template())
			$('.bg-video-container').css('opacity', 1)
		},

		events: {
			'click .button-submit': 'submit',
			'focus input': 'clearError',
			'keyup input': 'validate'
		},

		submit: function(e){
			e.preventDefault()
			if (this.invalidMessage) {
				this.displayError(null, this.invalidMessage)
				return false;
			}
			this.model.url = $(e.target).data('route')

			this.model.save()

		},

		loginSuccess: function(model, res){

			if (res._id) {
				this.model.set(res)
				this.model.unset('password')

				window.location.hash = 'location'
			}

		},

		loginError: function(model, res){
			this.displayError(model, res.responseText)
		},

		validate: function(e){
			$(e.target).parent().addClass('has-success').removeClass('has-error')
			var email = this.$('input[name="email"]').val()
			var password = this.$('input[name="password"]').val()
			this.model.set({
				email: email,
				password: password
			}, {validate: true})
		},

		highlightError: function(model, msg){
			$('input[name="' + msg.field + '"').parent().addClass('has-error').removeClass('has-success')
			this.invalidMessage = msg.msg
		},

		setValid: function(){

			this.invalidMessage = null
		},

		displayError: function(model, msg){
			var $text = this.$('.form-control')
			$text.addClass('shake')
			$text.one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function () {
				$text.removeClass('shake')
			});

			this.$('.error-message').text(msg).addClass('error-message-show')
		},

		clearError: function(){
			this.$('.error-message').removeClass('error-message-show')
		}

	})

})