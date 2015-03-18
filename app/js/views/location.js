define([
	'backbone',
	'jade',
	'typeahead',
	'views/location-select',
	'views/avatar',
	'text!templates/location.jade'
], function(Backbone, jade, typehead, Select, Avatar, template){

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
	 
			cb(matches)
		}

	}

	function getMarkerDistance(lat1,lon1,lat2,lon2) {
	  var R = 6371; // Radius of the earth in km
	  var dLat = deg2rad(lat2-lat1);  // deg2rad below
	  var dLon = deg2rad(lon2-lon1); 
	  var a = 
	    Math.sin(dLat/2) * Math.sin(dLat/2) +
	    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
	    Math.sin(dLon/2) * Math.sin(dLon/2)
	    ; 
	  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
	  var d = R * c; // Distance in km
	  return d;
	}

	function deg2rad(deg) {
	  return deg * (Math.PI/180)
	}

	return Backbone.View.extend({

		el: '.wrapper',

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

			this.listenTo(this.collection, 'fetched', this.render)

		},

		render: function(){

			// remove loader here
			$('.loading-spinner').hide()

			// In render so there's a collection to work with
			this.listenTo(this.collection, 'geo', this.getClosestSpot)

			this.fieldData[0].items = this.getSpots('continent')
			this.$el.html(this.template())

			this.showMap()
			this.addMarkers()
			this.typeaheadArr = this.getTypeaheadArr()

			// render fields after rendering the map to center the map on the selected field
			this.renderFields()

			this.searchbox()

			this.$('.user').html(new Avatar({model: this.attributes.user}).$el)
		},

		renderFields: function(){
			this.$('.location-selects').empty()
			_.each(this.fieldData, function(field, i){
				this.renderField(field, i)
			}, this)
		},

		renderField: function(field, i){

			var selectField = new Select({attributes: field})
			this.$('.location-selects')
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

			if (selectedValue && i === 2) {
				coords = this.getSpotAttrs('lat', 'lng')
				this.centerMap(coords)
			}
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
			var text = $('.tt-input').val()

				// parding the spot
				var parts = text.split(' ('),
					ending = parts.pop().split(', '),
					continent = ending.pop().split(')')[0],
					region = ending.join(', '),
					spot = parts.join(' (')

				this.setSelects(continent, region, spot)


		},

		setSelects: function(){
			_.each(arguments, function(val, i){
				this.fieldData[i].selected = val
			}, this)
			this.renderFields()
		},

		getTypeaheadArr: function(){

			return _.map(this.collection.toJSON(), function(spot){
				return spot.spot + ' (' + spot.region + ', ' + spot.continent + ')'
			})

		},

		searchbox: function(){

			this.$('.typehead.form-control').typeahead({
				highlight: true
			},
			{
				source: substringMatcher(this.typeaheadArr)
			})
		},

		getSpotAttrs: function(){

			var spot = this.collection.findWhere({
				continent: this.fieldData[0].selected,
				region: this.fieldData[1].selected,
				spot: this.fieldData[2].selected
			})
			return _.map(arguments, function(attr){
				return spot.get(attr)
			})
		},

		goToSpot: function(e){
			e.preventDefault()

			id = this.getSpotAttrs('_id')
			window.location.hash = 'spot/' + encodeURIComponent(this.fieldData[2].selected) + '/' + id

		},

		showMap: function(){

			this.map = new google.maps.Map(this.$('#map-canvas')[0],
				{
					zoom: 10,
					mapTypeId: google.maps.MapTypeId.HYBRID
				}
			);
		},

		centerMap: function(coords){

			this.map.setCenter({
				lat: coords[0],
				lng: coords[1]
			})
		},

		addMarkers: function(coords, map){
			var view = this
			view.collection.each(function(model){
				var spotCoords = new google.maps.LatLng(model.get('lat'), model.get('lng'));
				var marker = new google.maps.Marker({
					position: spotCoords,
					map: this.map,
					title: model.get('spot'),
					id: model.get('_id'),
					icon: '../../img/surf-marker.svg'
				})

				google.maps.event.addListener(marker, 'click', function(){

					var spot = view.collection.findWhere({_id: this.id})
					view.setSelects(spot.get('continent'), spot.get('region'), spot.get('spot'))

				})

			}, this)
		},

		getClosestSpot: function (pos) {
			var lat = pos.coords.latitude
			var lng = pos.coords.longitude

			var spots = this.getOneOfEachRegion()
			var closestSpot, closestDistance = Infinity

			this.collection.each( function (spot) {

				var dist = getMarkerDistance(lat, lng, spot.get('lat'), spot.get('lng'))
				if (dist < closestDistance){
					closestDistance = dist
					closestSpot = spot
				}
			})

			this.setSelects(
				closestSpot.get('continent'),
				closestSpot.get('region'),
				closestSpot.get('spot')
			);

		},

		getOneOfEachRegion: function(){
			var cache = []
			var spots = []
			this.collection.each(function (spot) {
				if(!_.contains(cache, spot.get('region'))){
					cache.push(spot.get('region'))
					spots.push(spot)
				}

			})
			return spots
		}


	})

})