define([
	'backbone',
	'jade',
	'pubsub',
	'text!templates/rate.jade',
	'views/rate-field',
	'views/avatar',
	'models/rating'
], function(Backbone, jade, pubsub, template, RateField, Avatar, Rating){
	'use strict'

	return Backbone.View.extend({

		template: jade.compile(template),

		newRating: {},

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
			}
		],

		el: '.wrapper',

		initialize: function(){
			pubsub.bind('pleaseLoginPulse', this.pleaseLoginPulse, this)
			this.render()
			this.$('a.rate-nav').attr('href', '#view-spot/' + this.attributes.title + '/' + this.id)
		},

		render: function(){
			this.$el.html(this.template({header: this.attributes.title}))

			this.renderFields()
			this.$('.user').html(new Avatar({model: this.attributes.user}).$el)

			if (!this.attributes.user.attributes._id){
				this.$('.help-text').removeClass('hidden')
			}
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

		pleaseLoginPulse: function () {
			var $text = this.$('.help-text')
			console.log($text)
			$text.addClass('pulse')
			$text.one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function () {
				$text.removeClass('pulse')
			});
		}


	})

})