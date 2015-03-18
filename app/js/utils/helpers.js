define([], function(){

	var deg2rad = function (deg) {
		return deg * (Math.PI/180)
	}

	return {

		substringMatcher: function(strs) {
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

		},

		getMarkerDistance: function (lat1,lon1,lat2,lon2) {
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
		},

		formatText: function(field, val){
			var formats = {
				wind: [
					'None (0-3 knots)',
					'Calm (4-9 knots)',
					'Strong (10-20 knots)',
					'High (20-40 knots)',
					'Stormy (40+ knots)'
				],
				measurement: [
					'Imperial',
					'Metric'
				],
				current: [
					'No current',
					'Mellow current',
					'Dangerous current'
				],
				experience: [
					'Beginner',
					'Novice',
					'Experienced',
					'World-Class'
				],
				suit: [
					'No',
					'Half',
					'Full'
				]
				
			}
			return formats[field] ? formats[field][val] : val
		},

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
			},
			{
				header: 'Current',
				max: 2,
				fieldName: 'current'
			},
			{
				header: 'Suitable For',
				max: 3,
				unit: 'surfers',
				fieldName: 'experience'
			},
			{
				header: 'Water Temprature',
				max: 2,
				unit: 'Suit Recommended',
				fieldName: 'suit'
			}
		],
	}
})