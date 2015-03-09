define([
	'backbone',
	'jade',
	'text!templates/login.jade',
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
			'click .btn': 'submit',
			'focus input': 'clearError'
		},

		submit: function(e){
			e.preventDefault()
			var username = this.$('input[name="username"]').val()
			var password = this.$('input[name="password"]').val()
			var formData = {
				username: username,
				password: password
			}

			var route = $(e.target).data('route')
			$.post(route, formData, function(data){
				if (data._id) {
					window.location.hash = 'location'
				}
			})			
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