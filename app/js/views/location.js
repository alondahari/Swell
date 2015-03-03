define([
	'backbone',
	'jade',
	'typehead',
	// 'googleMaps',
	'views/location-select',
	'text!templates/location.jade'
], function(Backbone, jade, typehead, Select, template){

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
			'click .tt-suggestion': 'typeaheadChange',
			'click .button-submit': 'goToSpot'
		},

		initialize: function(){
			this.typeaheadArr = this.getTypeaheadArr()
			this.fieldData[0].items = this.getSpots('continent')
			this.render()
			this.searchbox()
			this.showMap()
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

		getSpots: function(category){
			var spots = _.unique(this.collection.pluck('continent'))
			return _.sortBy(spots, function(spot){
				return spot
			})
		},

		populateNextField: function(i, selectedValue){
			selectedValue = selectedValue || this.fieldData[i].items[0]
			if (i === 0) {
				this.fieldData[1].items = _.chain(this.collection.where({continent: selectedValue
				}))
					.map(function(val) {
						return val.attributes.region
					})
					.unique().sortBy(function(spot){
						return spot
					}).value()
			} else {
				this.fieldData[2].items = _.chain(this.collection.where({region: selectedValue}))
					.map(function(val) {
						return val.attributes.spot
					})
					.unique().sortBy(function(spot){
						return spot
					}).value()
			}
			
		},

		typeaheadChange: function(){
			var text = $('.tt-input').val(),
				spot, region, continent

			if (text.match(/\(/g)) {
				// spot
				var parts = text.split(' (')
				var ending = parts.pop()
				ending = ending.split(', ')

				this.fieldData[2].selected = parts.join('(')
				this.fieldData[1].selected = ending.shift()
				this.fieldData[0].selected = ending[0].split(')')[0]

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

		goToSpot: function(e){
			e.preventDefault()
			var id = this.collection.findWhere({
				continent: this.fieldData[0].selected,
				region: this.fieldData[1].selected,
				spot: this.fieldData[2].selected
			}).get('_id')

			location = '#spot/' + this.fieldData[2].selected + '/' + id

		},

		showMap: function(){

		}


	})

})