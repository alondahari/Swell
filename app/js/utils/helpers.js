define([], function(){

	return {
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