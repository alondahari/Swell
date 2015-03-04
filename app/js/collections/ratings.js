define([
	'backbone',
	'models/rating',
	'localStorage',
	'moment'
	], function(Backbone, rating, Store, moment){
	'use strict'
	
	return Backbone.Collection.extend({
		
		model: rating,

		// localStorage: new Store('ratings'),

		initialize: function(){
		},

		/**
		 * filter out ratings older than 6 hours and ratings for different field
		 * @param  {integer} older ratings will be filtered out
		 * @param  {string} the name of the surf spot
		 * @param  {string} rating field
		 * @return {array} filtered array
		 */
		filterRatings: function(cutOff, field){

			return this.filter(function(model){
					return (model.get('time') > cutOff && model.get('fieldName') === field)
				})
		},

		/**
		 * return the average rating for a specific field
		 * @param  {string}
		 * @param  {string}
		 * @return {integer}
		 */
		getAverage: function(field){

			// 21600000 is 6 hours in ms
			var cutOff = Date.now() - 21600000
			var ratings = this.filterRatings(cutOff, field)

			// get the addition of all the timestamps of the ratings
			var voteAmount = _.reduce(ratings, function(memo, num){
				return memo + num.get('time') - cutOff
			}, 0)

			var tallyVotes = _.reduce(ratings, function(memo, num){
				// tally all the ratings, multiplied by the time
				// subtract cutOff to add more weight to the relative time difference
				var newVote = (num.get('time') - cutOff ) * num.get('value')
				return memo + newVote
			}, 0)

			return Math.round(tallyVotes / voteAmount) || 0

		},

		getTime: function(field){
			var cutOff = Date.now() - 21600000
			var ratings = this.filterRatings(cutOff, field)
			if (ratings.length) {
				var mostRecent = _.max(ratings, function(rating){
					return rating.get('time')
				}).get('time')
				return moment(mostRecent).fromNow()
			}
		},

	})
	
})