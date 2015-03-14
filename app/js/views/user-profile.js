define([
	'backbone',
	'jade',
	'models/setting',
	'views/rate-field',
	'text!templates/user-profile.jade',
	'underscore'
], function(Backbone, jade, Setting, RateField, template, _){


	return Backbone.View.extend({

		el: '.wrapper',

		template: jade.compile(template),

		feedbackMessage: '',

		events: {
			'keyup .field-input': 'changeField',
			'keydown .field-input': 'preventNewLine',
			'blur .field-input': 'save'
		},

		settings: [
		{ 
			fieldName: 'ignoreRating',
			header: 'Ignore ratings older than',
			value: 6,
			unit: 'hours',
			max: 12,
			min: 2
		},
		{
			fieldName: 'measurement',
			header: 'Measurement system',
			value: 0,
			max: 1
		}
		],

		initialize: function(){
			navigator.getUserMedia  = navigator.getUserMedia ||
																navigator.webkitGetUserMedia ||
																navigator.mozGetUserMedia ||
																navigator.msGetUserMedia;

			// var video = document.querySelector('video');

			if (navigator.getUserMedia) {
				navigator.getUserMedia({audio: true, video: true}, function(stream) {
					video.src = window.URL.createObjectURL(stream);
				}, errorCallback);
			} else {
				video.src = 'somevideo.webm'; // fallback.
			}

			this.cacheUser = this.model.toJSON()
			this.listenTo(this.model, 'sync invalid error', this.setMessage)
			
			this.render()

		},

		render: function(model, err){
			$('.loading-spinner').hide()

			var user = this.model
			this.$el.html(this.template({user: this.cacheUser, feedbackMessage: this.feedbackMessage}))

			this.settings.forEach(function(setting){
				var field = new Setting(setting)
				this.$('.setting-sliders').append(new RateField({model: field, attributes: {user: user}}).$el)
			})
		},

		preventNewLine: function(e){
			if(e.which === 13){
				e.preventDefault()
				$(e.target).blur()
			}
		},

		changeField: function(e){
			var $target = $(e.target)
			var field = $target.data('field')
			var newValue = $target.text()
			this.feedbackMessage =  'Saving...'
			if (newValue !== 'Dude') {
				this.model.attributes[field] = newValue
			};


		},

		save: function(e){

			if (_.isEqual(this.cacheUser, this.model.toJSON())) return false
				
			this.model.url = backendPath + '/user'
			this.model.save()
		},

		userUpdate: function(model, err){
			
			this.$('.saving').text( text ).removeClass('saving')

		},

		setMessage: function(model, err){

			if (err.msg || err.responseText) {
				this.model.set(this.cacheUser)
				this.feedbackMessage = err.msg || err.responseText
			}
			if (!_.isEqual(this.cacheUser, this.model.toJSON())) {

				this.cacheUser = this.model.toJSON()
				this.feedbackMessage = 'New Settings Saved!'
			}

			this.render()
		}



	})

})