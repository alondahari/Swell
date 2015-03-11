define([
	'backbone',
	'jade',
	'text!templates/login.jade',
], function(Backbone, jade, template){

	var validate = {
		email: /^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/,
		password: /^[\w\d!@#$%]{6,}$/
	}

	return Backbone.View.extend({

		el: $('.wrapper'),

		template: jade.compile(template),

		initialize: function(){
			this.render()
		},

		render: function(){
			this.$el.html(this.template())	
		},

		events: {
			'click .btn': 'submit',
			'focus input': 'clearError',
			'keyup input': 'validate'
		},

		submit: function(e){
			var view = this
			var email = this.$('input[name="email"]').val()
			var password = this.$('input[name="password"]').val()

			if (!email.match(validate.email)) {
				this.errorMessage('Please enter a valid email address')
				return false;
			}
			
			if (!password.match(validate.password)) {
				this.errorMessage('Password must contain at least 6 letters, digits or special characters')
				return false;
			}

			var formData = {
				email: email,
				password: password
			}

			var route = $(e.target).data('route')
			$.post(route, formData, function(data){
				if (data._id) {
					// window.location.hash = 'location'
					console.log(data)
				} else {
					view.errorMessage(data)
				}
			})			
			e.preventDefault()
		},

		validate: function(e){
			this.clearError()
			var field = e.target.name
			var val = e.target.value
			var match = val.match(validate[field])
			$(e.target).parent().toggleClass('has-success', !!match).toggleClass('has-error', !match)
		},

		errorMessage: function(msg){
			this.$('.error-message').text(msg).addClass('error-message-show')
		},

		clearError: function(){
			this.$('.error-message').removeClass('error-message-show')
		}

	})

})