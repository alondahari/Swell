define([
  '/app/js/collections/ratings.js'
  ], function (
  	Ratings
  ) {

	describe("ratings collection", function() {
		
		it("should fetch all ratings on init", function() {
			var localStorageKeys = _.keys(localStorage);
			var localRatings = _.filter(localStorageKeys, function(val){
				return val.indexOf('ratings-') >= 0
			})
			ratings = new Ratings();
			expect(ratings.length).toEqual(localRatings.length);
		});


	});
});