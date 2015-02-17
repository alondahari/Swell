define([
	'backbone',
	'handlebars',
	'text!templates/login.html'
], function(Backbone, handlebars, template){
	'use strict';

	return Backbone.View.extend({

		el: $('.container'),

		template: handlebars.compile(template),

		initialize: function(){
			this.render();
		},

		render: function(){
			this.$el.html(this.template());	
		},

		events: {
			'submit form': 'preventDefault',
			'click .button-signup': 'signup',
			'click .button-login': 'login',
			'focus input': 'clearError'
		},

		preventDefault: function(e){
			e.preventDefault();
		},

		userExists: function(user){
			return _.contains(this.collection.pluck('name'), user);
		},

		validateUser: function(user, pass){
			var creds = this.collection.where({name: user});
			return (creds.length && creds[0].get('password') === pass);
		},

		clearError: function(){
			this.$el.find('.error-message').text('');
		},

		login: function(){

			var user = this.$el.find('input[type=email]').val();
			var password = this.$el.find('input[type=password]').val();

			if (!this.validateUser(user, password)) {
				this.$el.find('.error-message').text('User or Password incorrect');
				return false;
			}
			
		},

		signup: function(e){
			var user = this.$el.find('input[type=email]').val();
			if (this.userExists(user)) {
				this.$el.find('.error-message').text('Username already exists');
				return false;
			}

			this.collection.create({
				name: this.$el.find('input[type=email]').val(),
				password: this.$el.find('input[type=password]').val()
			});
		}

	});

});