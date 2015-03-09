define([
	'backbone',
	'database',
	'models/user',
	'collections/users',
	'views/login',
	'views/location',
	'views/rate',
	'views/spot',
  'collections/spots',
  'collections/ratings'
  ], function(
  	Backbone,
  	Database,
  	User,
  	Users,
  	Login,
  	LocationView,
  	RateView,
  	SpotView,
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
			'user': 'user'
		},

		login: function(){
			var users = new Users()
			return new Login({collection: users})
		},

		location: function(){
			if (this.spots) {
  			new LocationView({ collection: this.spots })
			} else {		
			  this.spots = new Spots()
			  this.spots.fetch({success: function(spots){
	  			new LocationView({ collection: spots })
				}})
			}

		},

		rate: function(title, id){
			return new RateView({ id: id, attributes: {title: title}})
		},

		viewSpot: function(title, id){
			var ratings = new Ratings()

			// get only ratings for the right spot
			ratings.url = '/ratings/' + id
			
			ratings.fetch({success: function(){
				return new SpotView({ collection: ratings, id: id, attributes: {title: title}})
			}})
		},

		user: function(){}

	})

})