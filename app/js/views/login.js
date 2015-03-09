define([
	'backbone',
	'jade',
	'text!templates/login.jade',
], function(Backbone, jade, template){

	var validate = {
		username: /^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/,
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

			var username = this.$('input[name="username"]').val()
			var password = this.$('input[name="password"]').val()
			
			if (!password.match(validate.password)) {
				this.errorMessage('Password must be at least 6 characters long, containing only letters, digits and special characters')
				return false;
			}

			var formData = {
				username: username,
				password: password
			}

			var route = $(e.target).data('route')
			$.post(route, formData, function(data){
				if (data._id) {
					window.location.hash = 'location'
				}
				console.log(data)
			})			
			e.preventDefault()
		},

		validate: function(e){
			var field = e.target.name
			var val = e.target.value
			var match = val.match(validate[field])
			$(e.target).parent().toggleClass('has-success', match).toggleClass('has-error', !match)
		},

		errorMessage: function(msg){
			this.$el.find('.error-message').text(msg)
		},

		userExists: function(user){
			return _.contains(this.collection.pluck('name'), user)
		},

		validateUser: function(user, pass){
			var creds = this.collection.where({name: user})
			return (creds.length && creds[0].get('password') === pass)
		},

		clearError: function(){
			this.$el.find('.error-message').text('')
		}

	})

})