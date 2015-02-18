define([
  '/app/js/collections/ratings.js',
  ], function (
  	Ratings
  ) {

	describe("ratings collection", function() {

		beforeEach(function(){
			ratings = new Ratings()
		})
		
		it("should fetch all ratings on init", function() {
			var localStorageKeys = _.keys(localStorage)
			var localRatings = _.filter(localStorageKeys, function(val){
				return val.indexOf('ratings-') >= 0
			})
			expect(ratings.length).toEqual(localRatings.length)
		});

		it("should filter out irrelevant ratings", function() {
			
			var cutOff = 100,
				field = "overall",
				spot_name = "Ward Avenue",
				fakeRatings = [
				// different spot - filter out
				{
					crowd: 51,
					overall: 10,
					spot_name: "County Line",
					time: 101,
					waveHeight: 6,
					wind: 2
				},
				// no overall field - filter out
				{
					crowd: 51,
					spot_name: "Ward Avenue",
					time: 101
				},
				// too old - filter out
				{
					overall: 2,
					spot_name: "Ward Avenue",
					time: 99
				},
				// keep
				{
					overall: 5,
					spot_name: "Ward Avenue",
					time: 101
				}
			]
			ratings.filterRatings.bind(fakeRatings);
			var filtered = ratings.filterRatings(cutOff, spot_name, field)
			
			expect(filtered.length).toBe(1)
			expect(filtered[0].get('overall')).toBe(5)

		});


	});
});