define([
	'backbone',
	'jade',
	'typehead',
	'views/location-select',
	'text!templates/location.jade'
], function(Backbone, jade, typehead, Select, template){
	'use strict'

	/**
	 * Helper to get next key in an object
	 * @param  {object} object object to iterate over
	 * @param  {string} key    current key
	 * @return {string}        next key
	 */
	var getNextKey = function(object, key){
		var keys = _.keys(object)
		var index = keys.indexOf(key)
		return keys[index + 1]
	}

	var getNextExistingValue = function(fields, collection, category, value){
		var records = collection.filter(function(val){
			return val.get(category) === value
		})
		var nextKey = getNextKey(fields, category)
		// if('key' in myObj)
		// if (){

		// }
	}

	var substringMatcher = function(strs) {
	  return function findMatches(q, cb) {
	    var matches = [], substrRegex
	 
	    // regex used to determine if a string contains the substring `q`
	    substrRegex = new RegExp(q, 'i')
	 
	    // iterate through the pool of strings and for any string that
	    // contains the substring `q`, add it to the `matches` array
	    $.each(strs, function(i, str) {
	      if (substrRegex.test(str)) {
	        // the typeahead jQuery plugin expects suggestions to a
	        // JavaScript object, refer to typeahead docs for more info
	        matches.push({ value: str })
	      }
	    })
	 
	    cb(matches);
	  }
	}

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
			'change .location-select': 'fieldChange',
			'keyup .tt-input': 'typeaheadChange',
			'click .tt-suggestion': 'typeaheadChange'
		},

		initialize: function(){
			this.fieldData.country.values = _.unique(this.collection.pluck('country'))
			this.render()
			this.searchbox()

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

			// select a value if it's the only one and render following field
			var selectedValue = selectField.$el.find(':selected').val()
			var category = field.category
			if (field.values.length === 1){
				this.populateChildrenFields(category, selectedValue)
			}

			// set all selected values in fieldData in case of passive field changes
			this.fieldData[category].selected = selectedValue
			this.populateSubmitButton()
		},

		fieldChange: function(e){
			var $target = $(e.currentTarget)
			var category = $target.data('category')
			var selectedValue = $target.find(':selected').val()
			getNextExistingValue(this.fieldData, this.collection, category, selectedValue)
			this.fieldData[category].selected = selectedValue

			this.populateChildrenFields(category, selectedValue)

			this.renderFields()
		},

		populateChildrenFields: function(category, selectedValue){
			if (category === 'country') {
				this.fieldData.county.values = _.chain(this.collection.where({country: selectedValue}))
					.map(function(val) {
						return val.attributes.county_name
					})
					.unique().value()
			} else if (category === 'county') {
				this.fieldData.spot.values = _.chain(this.collection.where({county_name: selectedValue}))
					.map(function(val) {
						return val.attributes.spot_name
					})
					.unique().value()
			}
		},

		typeaheadChange: function(e){
			// update location selects
		},

		searchbox: function(){

			var countries = [],
					counties = [],
					spots = []

			_.each(this.collection.toJSON(), function(spot){
				countries.push(spot.country)
				counties.push(spot.county_name + ', ' + spot.country)
				spots.push(spot.spot_name + ' (' + spot.county_name + ', ' + spot.country + ')')
			})

			countries = _.unique(countries)
			counties = _.unique(counties)

			this.$el.find('.typehead').typeahead({
			  highlight: true
			},
			{
			  name: 'countries',
			  displayKey: 'value',
			  source: substringMatcher(countries)
			},
			{
			  name: 'counties',
			  displayKey: 'value',
			  source: substringMatcher(counties),
			},
			{
			  name: 'spots',
			  displayKey: 'value',
			  source: substringMatcher(spots),
			})
		},

		populateSubmitButton: function(){
			var selectedValue = this.fieldData.spot.selected
				// would return more than one spot if more than one exists!!
				// need to pass spot_id to the option fields
			$('.button-submit')
				.toggleClass('disabled', !selectedValue)
				.attr('href', '#spot/' + selectedValue)

		}


	})

})