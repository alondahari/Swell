define(['backbone', 'models/rating', 'localStorage'], function(Backbone, rating, Store){
	'use strict';
	
	return Backbone.Collection.extend({
		
		model: rating,

		localStorage: new Store('ratings'),

		initialize: function(){
			this.on('add', this.addRating);
		},

		getAverage: function(spot_name, field){
			var currentTime = Date.now();
			// 43200000 - ms to 6 hours
			var cutOff = currentTime - 21600000;
			var ratings = this.where({spot_name: spot_name});

			// filter out old ratings and ratings without the required field
			ratings = ratings.filter(function(val){
				return (val.get('time') > cutOff && val.get(field));
			});

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