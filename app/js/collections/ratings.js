define(['backbone', 'models/rating', 'localStorage'], function(Backbone, rating, Store){
	'use strict';
	
	return Backbone.Collection.extend({
		
		model: rating,

		localStorage: new Store('ratings'),

		initialize: function(){
			// get data from local storage
			this.fetch();
		},

		/**
		 * return ratings for the passed surf spot,
		 * filtering out ratings older than 6 hours and ratings without the specified field
		 * @param  {integer} older ratings will be filtered out
		 * @param  {string} the name of the surf spot
		 * @param  {string} rating field
		 * @return {array} filtered array
		 */
		filterRatings: function(cutOff, spot_name, field){

			return this.where({spot_name: spot_name})
				.filter(function(val){
					return (val.get('time') > cutOff && val.get(field));
				});
		},

		/**
		 * return the average rating for a specific field
		 * @param  {string}
		 * @param  {string}
		 * @return {integer}
		 */
		getAverage: function(spot_name, field){
			var currentTime = Date.now();

			// 21600000 is 6 hours in ms
			var cutOff = currentTime - 21600000;
			var ratings = this.filterRatings(cutOff, spot_name, field);

			// get the addition of all the timestamps of the ratings
			var voteAmount = _.reduce(ratings, function(memo, num){
				return memo + num.get('time');
			}, 0);

			var tallyVotes = _.reduce(ratings, function(memo, num){
				// tally all the ratings of the passed field, multiplied by the time
				return memo + (num.get('time') * num.get(field));
			}, 0);

			return Math.round(tallyVotes / voteAmount) || 0;

		}

	});
	
});