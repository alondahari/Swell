define([
	'backbone',
	'jade',
	'views/location-select',
	'text!templates/location.jade'
], function(Backbone, jade, Select, template){
	'use strict'

	return Backbone.View.extend({

		fieldData: {
			country: {
				category: 'country',
				title: 'Country',
				values: []
			},
			county: {
				category: 'county',
				title: 'County',
				values: []
			},
			spot: {
				category: 'spot',
				title: 'Surf Spot',
				values: []
			}
		},

		template: jade.compile(template),

		events: {
			// @refactor: combine into one event handler
			// @refactor: capitalize field categories
			'change .location-select': 'fieldChange'
		},

		initialize: function(){
			this.fieldData.country.values = _.unique(this.collection.pluck('country'))
			this.render()

		},

		render: function(){
			this.$el.html(this.template())
			this.renderFields()
			$('.wrapper').html(this.$el)
		},

		renderFields: function(){
			this.$el.find('.location-selects').empty()
			_.each(this.fieldData, function(field){
				this.renderField(field)
			}, this)
		},

		renderField: function(field){
			var selectField = new Select({attributes: field})
			this.$el.find('.location-selects')
				.append(selectField.$el)
				// @refactor: move to template
				.prop('disabled', !(this[field] && this[field].length) )
				.focus()
				// trigger change to disable button when country change 
				// doesn't trigger on it's own?
				.trigger('change')
		},

		fieldChange: function(e){
			var $target = $(e.currentTarget)
			var category = $target.data('category')
			var selectedValue = $target.find(':selected').val()
			this.fieldData[category].selected = selectedValue

			if (category === 'country') {
				this.fieldData.county.values = _.chain(this.collection.where({country: selectedValue}))
					.map(function(val) {
						return val.attributes.county_name
					})
					.unique().value()
			} else if (category === 'county') {
				this.fieldData.spot.values = _.chain(this.collection.where({county: selectedValue}))
					.map(function(val) {
						return val.attributes.spot_name
					})
					.unique().value()
			}

			this.renderFields()
		},

		/**
		 * update county field when a country is selected
		 * render spot field as well for when the country is changed after spot selected
		 * @param  {event}
		 */
		countryChange: function(e){
			var country = $.trim($(e.currentTarget).find(':selected').val())
			var county = this.collection.where({country: country})
			this.county = _.chain(county)
				.map(function(val) {
					return val.attributes.county_name
				})
				.unique().value()

				this.renderFields()
		},

		/**
		 * update spot field when a county is selected
		 * @param  {event}
		 */
		countyChange: function(e){
			var county = $.trim($(e.currentTarget).find(':selected').val())
			var spot = this.collection.where({county_name: county})
			this.spot = _.chain(spot)
				.map(function(val) {
					return val.attributes.spot_name
				})
				.unique().value()

			this.renderFields()
		},

		/**
		 * on spot select, enable submit button and set it's href
		 * @param  {event}
		 */
		spotChange: function(e){
			// would return more than one spot if more than one exists!!
			// need to pass spot_id to the option fields
			var spotName = $(e.currentTarget).find(':selected').val()

			$('.button-submit')
				.toggleClass('disabled', !spotName)
				.attr('href', '#spot/' + spotName)

		}


	})

})