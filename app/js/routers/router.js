define([
	'backbone',
	'models/user',
	'views/login',
	'views/location',
	'views/rate',
	'views/spot',
	'views/user-profile',
  'collections/spots',
  'collections/ratings'
  ], function(
  	Backbone,
  	User,
  	Login,
  	LocationView,
  	RateView,
  	SpotView,
  	userProfile,
  	Spots,
  	Ratings
  ){

	var Router =  Backbone.Router.extend({

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
			this.user = new User()
			this.user.fetch(function(model, res){
				console.log(res)
			})
			return new Login({ model: this.user })
		},

		location: function(){
			if (!this.user) return window.location.hash = ''
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
			if (!this.user) return window.location.hash = ''
			return new RateView({ id: id, attributes: {title: title}})
		},

		viewSpot: function(title, id){
			if (!this.user) return window.location.hash = ''
			var ratings = new Ratings()

			// get only ratings for the right spot
			ratings.url = '/ratings/' + id
			
			ratings.fetch({success: function(){
				return new SpotView({ collection: ratings, id: id, attributes: {title: title}})
			}})
		},

		userProfile: function(){
			if (!this.user) return window.location.hash = ''
			return new userProfile()

		}

	})

	return new Router()
})