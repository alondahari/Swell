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

		initialize: function(){
			this.listenTo(this, 'route', this.removeViews)
		},

		routes:{
			'': 'location',
			'login': 'login',
			'spot/:title/:id': 'rate',
			'view-spot/:title/:id': 'spot',
			'user': 'user'
		},

		login: function(){
			this.loginView = new Login({ model: this.user })

		},

		location: function(){
			if (this.spots) {
				this.spots.trigger('fetched')
				this.spots.getUserLocation()
  			this.locationView = new LocationView({ collection: this.spots, attributes: {user: this.user} })
			} else {		
			  this.spots = new Spots()
  			this.locationView = new LocationView({ collection: this.spots, attributes: {user: this.user} })
			}

		},

		rate: function(title, id){
			this.rateView = new RateView({ id: id, attributes: {title: title, user: this.user}})
		},

		spot: function(title, id){
			var ratings = new Ratings()

			// get only ratings for the right spot
			ratings.url = '/ratings/' + id
			
			ratings.fetch({success: function(collection){
				collection.trigger('fetched')
			}})

			this.spotView = new SpotView({ collection: ratings, id: id, attributes: {title: title, user: this.user}})
		},

		user: function(){

				console.log(this.user)
			if (!this.user || !this.user.get('_id'))
				return window.location.hash = ''
			this.userView =  new userProfile({model: this.user})

		},

		removeViews: function (route) {
			if (this.loginView && route != 'login') this.loginView.undelegateEvents()
			if (this.locationView && route != 'location') this.locationView.undelegateEvents()
			if (this.rateView && route != 'rate') this.rateView.undelegateEvents()
			if (this.spotView && route != 'spot') this.spotView.undelegateEvents()
			if (this.userView && route != 'user') this.userView.undelegateEvents()

		}

	})
})