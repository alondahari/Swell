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

		fieldData: [
			{
				category: 'continent',
				items: []
			},
			{
				category: 'region',
				items: []
			},
			{
				category: 'spot',
				items: []
			}
		],

		template: jade.compile(template),

		events: {
			'change .location-select': 'fieldChange',
			'keyup .tt-input': 'typeaheadChange',
			'click .tt-suggestion': 'typeaheadChange'
		},

		initialize: function(){
			this.fieldData[0].items = _.unique(this.collection.pluck('continent'))
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
			_.each(this.fieldData, function(field, i){
				this.renderField(field, i)
			}, this)
		},

		renderField: function(field, i){

			var selectField = new Select({attributes: field})
			this.$el.find('.location-selects')
				.append(selectField.$el)

			// set all selected items in fieldData in case of passive field changes
			this.fieldData[i].selected = selectField.$el.find(':selected').val()
			this.updateFieldValue(i)
			this.populateSubmitButton()
		},

		fieldChange: function(e){
			var i = $(e.currentTarget).index('.location-select')
			this.updateFieldValue(i)
			this.renderFields()
		},

		updateFieldValue: function(i){
			var selectedValue = this.getSelectedValue(i)
			this.fieldData[i].selected = selectedValue
			this.populateChildrenFields(i, selectedValue)
		},

		getSelectedValue: function(i){
			return $('.location-select').eq(i).find(':selected').val()
		},

		populateChildrenFields: function(i, selectedValue){
			selectedValue = selectedValue || this.fieldData[i].items[0]
			if (i === 0) {
				this.fieldData[1].items = _.chain(this.collection.where({continent: selectedValue
				}))
				.map(function(val) {
					return val.attributes.region
				})
				.unique().value()

				this.populateChildrenFields(1)
			} else {
				this.fieldData[2].items = _.chain(this.collection.where({region: selectedValue}))
					.map(function(val) {
						return val.attributes.spot
					})
					.unique().value()
			}
			
			
		},

		typeaheadChange: function(){
			var text = $('.tt-input').val(),
				spot, region, continent

			if (text.match(/\(/g)) {
				// spot
				var parts = text.split('(')
				var ending = parts.splice(parts.length - 1)
				ending = ending[0].split(', ')

				spot = parts.join('(')
				region = ending[0]
				continent = ending[1].split(')')[0]

			} else if (text.match(/,/g)) {
				// region
				var arr = text.split(', ')
				region = arr[0]
				continent = arr[1]

			} else {
				// continent
				continent = text
			}

		},

		searchbox: function(){

			var continents = [],
					regions = [],
					spots = []

			_.each(this.collection.toJSON(), function(spot){
				continents.push(spot.continent)
				regions.push(spot.region + ', ' + spot.continent)
				spots.push(spot.spot + ' (' + spot.region + ', ' + spot.continent + ')')
			})

			continents = _.unique(continents)
			regions = _.unique(regions)

			this.$el.find('.typehead').typeahead({
			  highlight: true
			},
			{
			  name: 'continents',
			  displayKey: 'value',
			  source: substringMatcher(continents)
			},
			{
			  name: 'regions',
			  displayKey: 'value',
			  source: substringMatcher(regions),
			},
			{
			  name: 'spots',
			  displayKey: 'value',
			  source: substringMatcher(spots),
			})
		},

		populateSubmitButton: function(){
			var selectedValue = this.fieldData[2].selected
				// would return more than one spot if more than one exists!!
				// need to pass spot_id to the option fields
			$('.button-submit')
				// .toggleClass('disabled', !selectedValue)
				.attr('href', '#spot/' + selectedValue)

		}


	})

})