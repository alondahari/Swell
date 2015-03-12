define([
	'backbone',
	'jade',
	'text!templates/rate.jade',
	'views/rate-field',
	'models/rating'
], function(Backbone, jade, template, RateField, Rating){
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

		initialize: function(){
			console.log(this)
			this.render()
			this.$('a.rate-nav').attr('href', '#view-spot/' + this.attributes.title + '/' + this.id)
		},

		render: function(){
			this.$el.html(this.template({header: this.attributes.title}))
			// not setting .wrapper as $el to keep all events within scope
			$('.wrapper').html(this.el)
			this.renderFields()
		},

		/**
		 * render the rating fields with a different template
		 */
		renderFields: function(){
			_.each(this.fields, function(field){
				var rateField = new RateField({model: new Rating(field), id: this.id})
				this.$('.ratings').append(rateField.$el)
			}, this)
		}


	})

})