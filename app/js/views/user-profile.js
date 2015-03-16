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
			'blur .field-input': 'save',
			'click .user-avatar': 'changeAvatar',
			'change #file-upload': 'fileUpload',
			'click .screen': 'pictureCaptureHide',
			'click .btn': 'pictureCaptureHide'
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
			}


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
		},

		fileUpload: function(e){
			var view = this
			var file = e.target.files[0]
			var size = (file.size/1024/1024).toFixed(4)

			fr = new FileReader()
			fr.onload = function (e) {
				var URI = e.currentTarget.result
				view.model.attributes.avatar = URI
				view.model.url = backendPath + '/user'
				view.model.save()
			}
			
			if (size < 16) {
				fr.readAsDataURL(file)
			} else {
				this.feedbackMessage = 'Image must be smaller than 16MB'
			}
		},

		pictureCaptureHide: function(){
			this.$('.image-capture-options').removeClass('image-capture-show')
			this.$('.screen').addClass('hidden')
			this.$('.button-take-photo').removeClass('hidden')
		},

		changeAvatar: function () {

			this.$('.screen').removeClass('hidden')
			if (navigator.getUserMedia) {
				
			} else {
					
				this.$('.button-take-photo').addClass('hidden')
			}
			this.$('.image-capture-options').addClass('image-capture-show')
		}



	})

})