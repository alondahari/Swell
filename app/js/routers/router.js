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
			'': 'login',
			'location': 'location',
			'spot/:title/:id': 'rate',
			'view-spot/:title/:id': 'viewSpot',
			'submit-rating': 'submitRating',
			'init-database': 'initDatabase',
			'user': 'userProfile'
		},

		login: function(){
			new Login({ model: this.user })

		},

		location: function(){
			console.log(this.user.get('userId'))
			if (!this.user.get('userId')) return this.navigate('')
			if (this.spots) {
				this.spots.trigger('fetched')
				this.spots.getUserLocation()
  			new LocationView({ collection: this.spots })
			} else {		
			  this.spots = new Spots()
  			new LocationView({ collection: this.spots })
			}

		},

		rate: function(title, id){
			if (!this.user) return this.navigate('')
			return new RateView({ id: id, attributes: {title: title}})
		},

		viewSpot: function(title, id){
			if (!this.user) return this.navigate('')
			var ratings = new Ratings()

			// get only ratings for the right spot
			ratings.url = '/ratings/' + id
			
			ratings.fetch({success: function(){
				return new SpotView({ collection: ratings, id: id, attributes: {title: title}})
			}})
		},

		userProfile: function(){
			if (!this.user) return this.navigate('')
			return new userProfile()

		}

	})
})