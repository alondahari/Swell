var mongoose = require('mongoose')
var _ = require('underscore')
var moment = require('moment')

var Rating = mongoose.model('ratings', {
	fieldName: String,
	userId: Number,
	time: Number,
	spotId: String,
	userId: String,
	value: Number
})

/**
 * filter out ratings older than 6 hours and ratings for different field
 * @param  {integer} older ratings will be filtered out
 * @param  {string} the name of the surf spot
 * @param  {string} rating field
 * @return {array} filtered array
 */
var filterRatings = function(ratings){

	// 21600000 is 6 hours in ms
	var cutOff = Date.now() - 21600000
	return ratings.filter(function(rating){
			return (rating.time > cutOff)
		})
}

/**
 * return the average rating for a specific field
 * @param  {string}
 * @param  {string}
 * @return {integer}
 */
var getAverage = function(ratings){

	var cutOff = Date.now() - 21600000
	ratings = filterRatings(ratings)

	// get the addition of all the timestamps of the ratings
	var voteAmount = _.reduce(ratings, function(memo, num){
		return memo + num.time - cutOff
	}, 0)

	var tallyVotes = _.reduce(ratings, function(memo, num){
		// tally all the ratings, multiplied by the time
		// subtract cutOff to add more weight to the relative time difference
		var newVote = (num.time - cutOff ) * num.value
		return memo + newVote
	}, 0)

	return Math.round(tallyVotes / voteAmount) || 0

}

var getTime = function(ratings){

	ratings = filterRatings(ratings)
	if (ratings.length) {
		var mostRecent = _.max(ratings, function(rating){
			return rating.time
		}).time
		return moment(mostRecent).fromNow()

	}
}

var getNumberOfVotes = function(ratings){
	return filterRatings(ratings).length
}

/**
 * routes
 */

module.exports = {

	getRatings: function(req, res) {

		Rating.find({spotId: req.params.id, fieldName: req.params.fieldName}, function(err, ratings){
			if (!err) {
				var average = getAverage(ratings)
				var time = getTime(ratings)
				var numberOfVotes = getNumberOfVotes(ratings)

				res.send({
					average: average,
					time: time,
					numberOfVotes: numberOfVotes
				})
			} else {
				console.log(err);
			}
		})
	},

	setRating: function(req, res) {

		var query = {spotId: req.body.spotId, fieldName: req.body.fieldName, userId: req.body.userId}
		Rating.remove(query, function(err){
			if (!err) {
				var rating = new Rating(req.body)
				rating.save(function(err, model){
					if (!err) {
						res.send(model)
						
					} else {
						res.send('error creating record:', err)
					}
				})
			} else {
				res.send('error removing record:', err)
			}
		})
		
	}
};