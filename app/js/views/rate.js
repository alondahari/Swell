define([
	'backbone',
	'jade',
	'utils/pubsub',
	'text!templates/rate.jade',
	'views/rate-field',
	'views/avatar',
	'views/user-comment-set',
	'models/rating',
	'models/user-comment',
	'utils/helpers'
], function(Backbone, jade, pubsub, template, RateField, Avatar, CommentView, Rating, UserComment, helpers){

	return Backbone.View.extend({

		template: jade.compile(template),

		// only arrays get persisted?
		currentLocation: [],

		fields: helpers.fields,

		el: '.wrapper',

		events: {
			'click .button-show-more': 'showMore'
		},

		initialize: function(){

			pubsub.bind('pleaseLoginPulse', this.pleaseLoginPulse, this)
			pubsub.bind('ratingChanged', this.persistRating, this)

			if (this.currentLocation[0] != this.id) {
				this.resetFieldValues()
			}

			this.render()
			this.$('a.rate-nav').attr('href', '#view-spot/' + encodeURIComponent(this.attributes.title) + '/' + this.id)
		},

		render: function(){
			
			$('.loading-logo').hide()
			this.$el.html(this.template({header: this.attributes.title}))

			this.renderFields()
			this.$('.user').html(new Avatar({model: this.attributes.user}).$el)

			if (!this.attributes.user.attributes._id){
				this.$('.help-text').removeClass('hidden')
			}

			this.renderUserComment()
		},

		/**
		 * render the rating fields with a different template
		 */
		renderFields: function(){
			_.each(this.fields, function(field, i){
				var rateField = new RateField({model: new Rating(field), id: this.id, attributes: {user: this.attributes.user}})
				if (i < 4) {
					this.$('.ratings').append(rateField.$el)
				} else {
					this.$('.ratings-extra').append(rateField.$el)
				}
			}, this)
		},

		renderUserComment: function(){
			this.$('.comment').html(new CommentView({ model: new UserComment(), id: this.id, attributes: {user: this.attributes.user}}).$el)
		},

		showMore: function(e){
			this.$('.ratings-extra').toggleClass('ratings-extra-hidden')
			var button = $(e.target)
			window.setTimeout(function() {
				button.text(button.text() === 'show more' ? 'show less' : 'show more')
			}, 300)
		},

		pleaseLoginPulse: function () {

			var $text = this.$('.help-text')
			$text.addClass('pulse')
			$text.one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function () {
				$text.removeClass('pulse')
			});
		},

		persistRating: function(rating){
			this.currentLocation[0] = this.id
			_.each(this.fields, function (field, i) {

				if (field.fieldName === rating.field) {
					this.fields[i].value = rating.value
				}
			}, this)
		},

		resetFieldValues: function () {
			_.each(this.fields, function (field, i) {
				delete this.fields[i].value
			}, this)
		}


	})

})