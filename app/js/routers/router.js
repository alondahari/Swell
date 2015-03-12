define([
	'backbone',
	'views/login',
	'views/location',
	'views/rate',
	'views/spot',
	'views/user-profile',
  'collections/spots',
  'collections/ratings'
  ], function(
  	Backbone,
  	Login,
  	LocationView,
  	RateView,
  	SpotView,
  	userProfile,
  	Spots,
  	Ratings
  ){

	return Backbone.Router.extend({

		routes:{
			'': 'location',
			'login': 'login',
			'spot/:title/:id': 'rate',
			'view-spot/:title/:id': 'viewSpot',
			'submit-rating': 'submitRating',
			'init-database': 'initDatabase',
			'user': 'userProfile'
		},

		login: function(){
			console.log(this.user.toJSON())
			new Login({ model: this.user })

		},

		location: function(){
			if (this.spots) {
				this.spots.trigger('fetched')
				this.spots.getUserLocation()
  			new LocationView({ collection: this.spots, attributes: {user: this.user} })
			} else {		
			  this.spots = new Spots()
  			new LocationView({ collection: this.spots, attributes: {user: this.user} })
			}

		},

		rate: function(title, id){
			return new RateView({ id: id, attributes: {title: title, user: this.user}})
		},

		viewSpot: function(title, id){
			var ratings = new Ratings()

			// get only ratings for the right spot
			ratings.url = '/ratings/' + id
			
			ratings.fetch({success: function(collection){
				collection.trigger('fetched')
			}})

			return new SpotView({ collection: ratings, id: id, attributes: {title: title, user: this.user}})
		},

		userProfile: function(){

			if (!this.user || !this.user.get('userId'))
				return window.location.hash = ''
			return new userProfile({model: this.user})

		}

	})
})