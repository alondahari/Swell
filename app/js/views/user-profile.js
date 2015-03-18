define([
	'backbone',
	'jade',
	'models/setting',
	'views/rate-field',
	'text!templates/user-profile.jade',
	'underscore',
	'utils/helpers'
], function(Backbone, jade, Setting, RateField, template, _, helpers){


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
			'click .image-capture-cancel': 'pictureCaptureHide',
			'click .image-capture-repeat': 'showVideoModal',
			'click .image-capture-save': 'savePhotoCapture',
			'click .capture': 'capturePhoto'
		},

		settings: [
		{ 
			fieldName: 'ignoreRating',
			header: 'Ignore ratings older than',
			unit: 'hours',
			max: 12,
			min: 2
		},
		{
			fieldName: 'measurement',
			header: 'Measurement system',
			max: 1
		}
		],

		initialize: function(){
			
			this.hasCamera()
			
			this.listenTo(this.model, 'sync invalid error', this.setMessage)

			this.cacheUser = this.model.toJSON()
			this.settings[0].value = this.model.get('ignoreRating')
			this.settings[1].value = this.model.get('measurement')

		},

		log: function(){
			console.log(arguments)
		},

		render: function(model, err){
			$('.loading-spinner').hide()

			this.$el.html(this.template({user: this.cacheUser, feedbackMessage: this.feedbackMessage}))
			this.renderSliders()

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

			var view = this

			MediaStreamTrack.getSources(function(mediaArr) {
				var cameraExists = mediaArr.some( function (media) {
					return media.kind === 'video'
				})

				view.model.set('camera', cameraExists && !!navigator.getUserMedia)
				view.cacheUser = view.model.toJSON()
				view.render()
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

		setMessage: function(model, err){
			this.pictureCaptureHide()
			$('.loading-spinner').hide()
			if (err.msg || err.responseText) {
				this.model.set(this.cacheUser)
				this.feedbackMessage = err.msg || err.responseText
				this.render()
				return false;
			}
			if (!_.isEqual(this.cacheUser, this.model.toJSON())) {

				if (model.get('avatar')) {
					this.$('img.user-avatar').attr('src', model.get('avatar'))
				}
				this.cacheUser = this.model.toJSON()
				this.feedbackMessage = 'New Settings Saved!'
				this.render()
			}

		},

		saveModel: function(thumbURI, view){
			view.model.attributes.thumbnail = thumbURI
			console.log(view.model)
			view.model.url = '/user'
			view.model.save()
		},

		fileUpload: function(e){
			var view = this
			var file = e.target.files[0]
			var size = (file.size/1024/1024).toFixed(4)

			fr = new FileReader()
			fr.onload = function (e) {
				var URI = e.currentTarget.result
				view.model.attributes.avatar = URI
				helpers.resizeImage(URI, 30, 30, view.saveModel, view)
				
			}
			
			if (size < 16) {
				fr.readAsDataURL(file)
				this.feedbackMessage = 'Saving...'
				$('.loading-spinner').show()
			} else {
				this.feedbackMessage = 'Image must be smaller than 16MB'	
			}
			this.render()
		},

		showVideoModal: function(){
			var view = this
			this.$('.capture').removeClass('hidden')
			this.$('.approve-photo').addClass('hidden')
			this.$('video').removeClass('hidden')
			this.$('canvas').addClass('hidden')
			this.$('.image-capture-options').removeClass('image-capture-show')
			this.$('.screen').removeClass('hidden')
			$('.video-modal').removeClass('hidden')
			navigator.getUserMedia({video: true}, function (stream) {
				$('video').attr('src', window.URL.createObjectURL(stream))
				view.stream = stream
			}, function (err) {
				console.log(err)
				view.feedbackMessage = 'Please allow access to your camera'
				view.pictureCaptureHide()
				this.render()
			})
		},

		capturePhoto: function(){
			var $canvas = this.$('canvas')
			var $video = this.$('video')
			var width = $video.width()
			var height = $video.height()
			$canvas.removeClass('hidden')
			$canvas.attr('width', width)
			$canvas.attr('height', height)
			$video.addClass('hidden')
			var canvas = $canvas[0]
			var video = $video[0]

			var context = canvas.getContext('2d')
			if (video.paused || video.ended) {
				this.feedbackMessage = 'Error, camera stream ended'
				this.pictureCaptureHide()
				this.render()
				return false
			}
			context.drawImage(video,0,0,width,height)
			this.avatarURI = canvas.toDataURL('image/png')

			this.$('.capture').addClass('hidden')
			this.$('.approve-photo').removeClass('hidden')
			this.stream.stop()
			
		},

		savePhotoCapture: function(){
			$('.loading-spinner').show()
			this.model.attributes.avatar = this.avatarURI
			this.model.url = '/user'
			this.model.save()
		},

		pictureCaptureHide: function(){
			$('.video-modal').addClass('hidden')
			this.$('.image-capture-options').removeClass('image-capture-show')
			this.$('.screen').addClass('hidden')
		},

		changeAvatar: function () {

			this.$('.screen').removeClass('hidden')
			this.$('.image-capture-options').addClass('image-capture-show')
		}



	})

})