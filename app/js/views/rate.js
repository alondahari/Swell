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

		fields: {
			overall: {
				header: 'Overall Wave Quality',
				max: 10,
				unit: '/ 10',
				fieldName: 'overall'
			},
			waveHeight: {
				header: 'Wave Height',
				max: 12,
				unit: 'ft',
				fieldName: 'waveHeight'
			},
			wind: {
				header: 'Wind',
				max: 4,
				fieldName: 'wind'
			},
			crowd: {
				header: 'Crowd',
				max: 200,
				unit: 'surfers',
				fieldName: 'crowd'
			}
		},

		initialize: function(){
			this.render()
			this.$el.find('a.rate-nav').attr('href', '#view-spot/' + this.attributes.title + '/' + this.id)
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
				this.$el.find('.ratings').append(rateField.$el)
			}, this)
		}


	})

})