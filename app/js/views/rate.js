define([
	'backbone',
	'jade',
	'moment',
	'text!templates/rate.jade',
	'views/rate-field'
], function(Backbone, jade, moment, template, RateField){
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
				max: 5,
				unit: 'mph',
				fieldName: 'wind'
			},
			crowd: {
				header: 'Crowd',
				max: 200,
				unit: 'surfers',
				fieldName: 'crowd'
			}
		},

		events: {
			'change .rating-input-range': 'updateRatings',
			'click .button-submit': 'submit'
		},

		initialize: function(){
			this.getAverages()
			_.each(this.fields, function(field, i){
				this.fields[i].time = this.fields[i].time ? 
					'Last updated ' + moment(this.fields[i].time).fromNow() :
					'No Recent Updates'
			}, this)
			this.render()
		},

		render: function(){
			this.$el.html(this.template({header: this.id}))
			// not setting .wrapper as $el to keep all events within scope
			$('.wrapper').html(this.el)
			this.renderFields()
		},

		/**
		 * render the rating fields with a different template
		 * refactor: make into a seperate view
		 */
		renderFields: function(){
			this.rateFields = _.map(this.fields, this.renderField, this)
		},

		renderField: function(field){
			var rateField = new RateField({attributes: field})
			this.$el.find('.ratings').append(rateField.$el)
			return rateField
		},

		/**
		 * reset fields, get available averages
		 */
		getAverages: function(){
			var fieldKeys = _.keys(this.fields)
			_.each(fieldKeys, function(key, i){
				this.fields[key].value = this.collection.getAverage(this.id, key)
				this.fields[key].time = this.collection.getTime(this.id, key)
			},this)
		},

		submit: function(){
			var newRating = {time: Date.now(), spot_name: this.id}
			_.each(this.rateFields, function(field){
				if (field.attributes.changed === true){
					newRating[field.attributes.fieldName] = field.attributes.value
				}
			})
			this.collection.create(newRating)
		}


	})

})