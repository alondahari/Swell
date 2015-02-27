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
	        // limit results for better performance
	        if (matches.length > 10) return false
	      }
	    })
	 
	    cb(matches);
	  }
	}

	return Backbone.View.extend({

		fieldData: [
			{
				// continents
				items: []
			},
			{
				// regions
				items: []
			},
			{
				// spots
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
			this.typeaheadArr = this.getTypeaheadArr()
			this.fieldData[0].items = _.unique(this.collection.pluck('continent'))
			this.render()
			this.searchbox()

		},

		render: function(){
			this.$el.html(this.template())
			$('.wrapper').html(this.$el)
			this.renderFields()
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
			this.updateFieldValue(i)
		},

		fieldChange: function(e){
			var i = $(e.currentTarget).index('.location-select')
			this.fieldData[i].selected = this.getSelectedValue(i)
			this.renderFields()
		},

		updateFieldValue: function(i){
			var selectedValue = this.getSelectedValue(i)
			this.fieldData[i].selected = selectedValue
			this.populateNextField(i, selectedValue)
		},

		getSelectedValue: function(i){
			return $('.location-select').eq(i).find(':selected').val()
		},

		populateNextField: function(i, selectedValue){
			selectedValue = selectedValue || this.fieldData[i].items[0]
			if (i === 0) {
				this.fieldData[1].items = _.chain(this.collection.where({continent: selectedValue
				}))
				.map(function(val) {
					return val.attributes.region
				})
				.unique().value()
			} else {
				this.fieldData[2].items = _.chain(this.collection.where({region: selectedValue}))
					.map(function(val) {
						return val.attributes.spot
					})
					.unique().value()
			}
			// would return more than one spot if more than one exists!!
			// need to pass spot_id to the option fields
			if (i === 2) this.populateSubmitButton(selectedValue)
			
		},

		typeaheadChange: function(){
			var text = $('.tt-input').val(),
				spot, region, continent

			if (text.match(/\(/g)) {
				// spot
				var parts = text.split(' (')
				var ending = parts.splice(parts.length - 1)
				ending = ending[0].split(', ')

				this.fieldData[2].selected = parts.join('(')
				this.fieldData[1].selected = ending[0]
				this.fieldData[0].selected = ending[1].split(')')[0]

			} else if (text.match(/,/g)) {
				// region
				var arr = text.split(', ')
				this.fieldData[0].selected = arr[arr.length - 1]
				arr.pop()
				this.fieldData[1].selected = arr.join(', ')

			} else {
				// continent
				this.fieldData[0].selected = text
			}
			this.renderFields()

		},

		getTypeaheadArr: function(){
			var arr = [],
				continents = [],
				regions = [],
				spots = []

			_.each(this.collection.toJSON(), function(spot){
				continents.push(spot.continent)
				regions.push(spot.region + ', ' + spot.continent)
				spots.push(spot.spot + ' (' + spot.region + ', ' + spot.continent + ')')
			})

			arr = continents.concat(regions, spots)

			return _.unique(arr)
		},

		searchbox: function(){

			this.$el.find('.typehead').typeahead({
			  highlight: true
			},
			{
			  source: substringMatcher(this.typeaheadArr)
			})
		},

		populateSubmitButton: function(selectedValue){

			this.$el.find('.button-submit').attr('href', '#spot/' + selectedValue)

		}


	})

})