define([
	'backbone',
	'jade',
	'pubsub',
	'text!templates/rate.jade',
	'views/rate-field',
	'views/avatar',
	'views/user-comment-set',
	'models/rating',
	'models/user-comment'
], function(Backbone, jade, pubsub, template, RateField, Avatar, CommentView, Rating, UserComment){

	return Backbone.View.extend({

		template: jade.compile(template),

		// only arrays get persisted?
		currentLocation: [],

		fields: [
			{
				header: 'Overall Wave Quality',
				max: 10,
				unit: '/ 10',
				fieldName: 'overall'
			},
			{
				header: 'Wave Height',
				max: 12,
				unit: 'ft',
				fieldName: 'waveHeight'
			},
			{
				header: 'Wind',
				max: 4,
				fieldName: 'wind'
			},
			{
				header: 'Crowd',
				max: 200,
				unit: 'surfers',
				fieldName: 'crowd'
			},
			{
				header: 'Current',
				max: 2,
				fieldName: 'current'
			},
			{
				header: 'Suitable For',
				max: 3,
				unit: 'surfers',
				fieldName: 'experience'
			},
			{
				header: 'Water Temprature',
				max: 2,
				unit: 'Suit Recommended',
				fieldName: 'suit'
			}
		],

		el: '.wrapper',

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
			
			$('.loading-spinner').hide()
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
			_.each(this.fields, function(field){
				var rateField = new RateField({model: new Rating(field), id: this.id, attributes: {user: this.attributes.user}})
				this.$('.ratings').append(rateField.$el)
			}, this)
		},

		renderUserComment: function(){
			this.$('.comment').html(new CommentView({ model: new UserComment(), id: this.id, attributes: {user: this.attributes.user}}).$el)
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