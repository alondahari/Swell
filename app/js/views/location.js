define([
	'backbone',
	'handlebars',
	'views/location-select',
	'text!templates/location.html'
], function(Backbone, handlebars, Select, template){
	'use strict'

	return Backbone.View.extend({

		template: handlebars.compile(template),

		events: {
			// @refactor: combine into one event handler
			// @refactor: capitalize field categories
			'change .country-select': 'countryChange',
			'change .county-select': 'countyChange',
			'change .spot-select': 'spotChange'
		},

		initialize: function(){
			this.country = _.unique(this.collection.pluck('country'))
			this.render()

		},

		render: function(){
			this.$el.html(this.template())
			this.renderFields(['country', 'county', 'spot'])
			$('.wrapper').html(this.$el)
		},

		renderFields: function(fields){
			this.$el.find('.location-selects').empty()
			_.each(fields, function(field){
				var selectField = new Select({attributes: {category: field, arr: this[field]}})
				this.$el.find('.location-selects')
					.append(selectField.$el)
					// @refactor: move to template
					.prop('disabled', !(this[field] && this[field].length) )
					.focus()
					// trigger change to disable button when country change 
					// doesn't trigger on it's own?
					.trigger('change')
			}, this)
		},

		renderSelect: function(category, arr, spotId){
			return this.templateSelects({category: category, arr: arr, spotId: spotId})
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

				this.renderFields(['country', 'county', 'spot'])
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

			this.renderFields(['country', 'county', 'spot'])
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