define(['backbone', 'models/rating'], function(Backbone, rating){
	'use strict';
	
	return Backbone.Collection.extend({
		
		model: rating,

		ratings: function(){
			return JSON.parse(localStorage.ratings);
		},

		initialize: function(){
			this.on('add', this.addRating);
		},

		addRating: function(){
			localStorage.ratings = JSON.stringify(this.toJSON());
		},

		getAverage: function(spot_name, field){
			var currentTime = Date.now();
			var cutOff = currentTime - 43200000;
			var ratings = _.chain(this.ratings())
				// get ratings for relevant spot
				.where({spot_name: spot_name})
				// get rid of old ratings
				.filter(function(val){
					return (val.time > cutOff);
				})
				.value();

			var voteAmount = _.reduce(ratings, function(memo, num){
				return memo + num.time;
			}, 0);

			var tallyVotes = _.reduce(ratings, function(memo, num){
				// tally all the ratings of the passed field, multiplied by the time
				return memo + (num.time * num[field]);
			}, 0);

			return tallyVotes / voteAmount;

		}

	});
	
});