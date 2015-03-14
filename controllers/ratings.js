var mongoose = require('mongoose')

var Rating = mongoose.model('ratings', {
	fieldName: String,
	userId: Number,
	time: Number,
	spotId: String,
	userId: String,
	value: Number
})

/**
 * routes
 */

module.exports = {

	getRatings: function(req, res) {

		Rating.find({spotId: req.params.id}, function(err, ratings){
			if (!err) {
				res.send(ratings)
			} else {
				console.log(err);
			}
		})
	},

	/**
	 * filter out ratings older than 6 hours and ratings for different field
	 * @param  {integer} older ratings will be filtered out
	 * @param  {string} the name of the surf spot
	 * @param  {string} rating field
	 * @return {array} filtered array
	 */
	filterRatings: function(field){

		// 21600000 is 6 hours in ms
		var cutOff = Date.now() - 21600000
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

		var cutOff = Date.now() - 21600000
		var ratings = this.filterRatings(field)

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

		var ratings = this.filterRatings(field)
		if (ratings.length) {
			var mostRecent = _.max(ratings, function(rating){
				return rating.get('time')
			}).get('time')
			return moment(mostRecent).fromNow()
		}
	},

	getNumberOfVotes: function(field){
		return this.filterRatings(field).length

	}

	setRating: function(req, res) {
		console.log(req.body)

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