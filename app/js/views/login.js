define([
	'backbone',
	'jade',
	'text!templates/login.jade'
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

		events: {
			'submit form': 'preventDefault',
			'click .button-signup': 'signup',
			'click .button-login': 'login',
			'focus input': 'clearError'
		},

		preventDefault: function(e){
			e.preventDefault()
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
		},

		login: function(){
			var email = this.$('input[name="email"]').val()
			var password = this.$('input[name="password"]').val()
			var formData = {
				email: email,
				password: password
			}
			$.post('/login', formData, function(err, data){
				console.log(err, data)
			})			
		},

		signup: function(e){
			var username = this.$('input[name="username"]').val()
			var password = this.$('input[name="password"]').val()
			var formData = {
				username: username,
				password: password
			}
			$.post('/signup', formData, function(err, data){
				console.log(err, data)
			})
		}

	})

})