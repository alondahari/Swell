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
			'click .avatar-has-camera': 'changeAvatar',
			'change #file-upload': 'fileUpload',
			'click .button-take-photo': 'showVideoModal',
			'click .screen': 'pictureCaptureHide',
			'click .btn': 'pictureCaptureHide',
			'click .capture': 'capturePhoto'
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
			this.model.set('camera', this.hasCamera())

			this.cacheUser = this.model.toJSON()
			this.listenTo(this.model, 'sync invalid error', this.setMessage)
			
			this.render()
			this.renderSliders()

		},

		render: function(model, err){
			$('.loading-spinner').hide()

			this.$el.html(this.template({user: this.cacheUser, feedbackMessage: this.feedbackMessage}))

		},

		renderSliders: function(){
			var user = this.model
			
			this.settings.forEach(function(setting){
				var field = new Setting(setting)
				this.$('.setting-sliders').append(new RateField({model: field, attributes: {user: user}}).$el)
			})
		},

		hasCamera: function(){
			navigator.getUserMedia = 
				navigator.getUserMedia ||
				navigator.webkitGetUserMedia ||
				navigator.mozGetUserMedia ||
				navigator.msGetUserMedia

			var cameraExists

			MediaStreamTrack.getSources(function(mediaArr) {
				cameraExists = mediaArr.some( function (media) {
					return media.kind === 'video'
				})
				return cameraExists && navigator.getUserMedia
			})
		},

		preventNewLine: function(e){
			if(e.which === 13){
				e.preventDefault()
				this.$('.settings-save').text('Saving...')
				$(e.target).blur()
			}
		},

		changeField: function(e){
			var $target = $(e.target)
			var field = $target.data('field')
			var newValue = $target.text()
			if (newValue !== 'Dude') {
				this.model.attributes[field] = newValue
			}

		},

		save: function(e){

			if (_.isEqual(this.cacheUser, this.model.toJSON())) return false
				
			this.model.url = '/user'
			this.model.save()
		},

		userUpdate: function(model, err){
			
			this.$('.saving').text( text ).removeClass('saving')

		},

		setMessage: function(model, err){
			if (err.msg || err.responseText) {
				this.model.set(this.cacheUser)
				this.$('.settings-save').text(err.msg || err.responseText)
			}
			if (!_.isEqual(this.cacheUser, this.model.toJSON())) {

				if (model.get('avatar')) {
					this.$('img.user-avatar').attr('src', model.get('avatar'))
				}
				this.cacheUser = this.model.toJSON()
				this.$('.settings-save').text('New Settings Saved!')
			}

		},

		fileUpload: function(e){
			var view = this
			var file = e.target.files[0]
			var size = (file.size/1024/1024).toFixed(4)

			fr = new FileReader()
			fr.onload = function (e) {
				var URI = e.currentTarget.result
				view.model.attributes.avatar = URI
				view.model.url = '/user'
				view.model.save()
			}
			
			if (size < 16) {
				fr.readAsDataURL(file)
				this.$('.settings-save').text('Saving...')
			} else {
				this.$('.settings-save').text('Image must be smaller than 16MB')
				
			}
		},

		showVideoModal: function(){
			$('.video-modal').removeClass('hidden')
			navigator.getUserMedia({video: true}, function () {
				$('video').attr('src', window.URL.createObjectURL(stream))
			}, function (err) {
				console.log(err)
			})
		},

		capturePhoto: function(){
			var canvas = $('canvas')[0]
			var context = canvas.getContext('2d')
			var video = $('video')[0]
			if (video.paused || video.ended) {
				console.log('Error, camera stream ended')
				return false
			}
			context.drawImage(video,0,0,'300px','300px')
			var URI = canvas.toDataURL('image/png')
			this.model.url = '/user'
			this.model.save()
		},

		pictureCaptureHide: function(){
			this.$('.image-capture-options').removeClass('image-capture-show')
			this.$('.screen').addClass('hidden')
		},

		changeAvatar: function () {

			this.$('.screen').removeClass('hidden')
			this.$('.image-capture-options').addClass('image-capture-show')
		}



	})

})