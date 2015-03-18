define([
	'backbone',
	'jade',
	'views/avatar',
	'views/view-rating',
	'views/user-comment-get',
	'models/rating',
	'text!templates/view.jade',
	'collections/user-comments',
	'utils/helpers'
], function(Backbone, jade, Avatar, ViewRating, CommentView, Rating, template, UserComments, helpers){

	return Backbone.View.extend({

		template: jade.compile(template),

		fields: helpers.fields,

		initialize: function(){
			this.render()
		},

		events: {
			'click .button-show-more': 'showMore'
		},

		render: function(){

			$('.loading-spinner').hide()
			this.$el.html(this.template({header: this.attributes.title}))
			// not setting .wrapper as $el to keep all events within scope
			$('.wrapper').html(this.el)

			this.renderFields()

			this.$('.user').html(new Avatar({model: this.attributes.user}).$el)
			this.$('a.rate-nav').attr('href', '#spot/' + encodeURIComponent(this.attributes.title) + '/' + this.id)

			this.renderComments()
		},

		/**
		 * render the rating fields with a different template
		 * refactor: make into a seperate view
		 */
		renderFields: function(){

			_.each(this.fields, function(field, i){
				var rating = new Rating()
				rating.url = '/rating/' + field.fieldName + '/' + this.id
				var rateField = new ViewRating({model: rating, attributes: {field: field, user: this.attributes.user}})
				if (i < 4) {
					this.$('.ratings').append(rateField.$el)
				} else {
					this.$('.ratings-extra').append(rateField.$el)
				}
			}, this)
		},

		renderComments: function(){

			var view = this
			var comments = new UserComments()
			comments.url = '/comments/' + this.id
			comments.fetch({success: function (model, res) {
				_.each(res, function (comment) {
					if (view.attributes.user.attributes._id === comment.userId) {
						comment.delButton = true
					}

					view.$('.comments').append(new CommentView({ model: comment }).$el)
				})
			}})
		},

		/**
		 * reset fields, get available averages
		 */
		getAverages: function(){
			var fieldKeys = _.keys(this.fields)
			_.each(fieldKeys, function(key, i){
				this.fields[key].value = this.collection.getAverage(key)
				this.fields[key].time = this.collection.getTime(key)
				this.fields[key].votes = this.collection.getNumberOfVotes(key)
			},this)
		},

		showMore: function(e){
			this.$('.ratings-extra').toggleClass('ratings-extra-hidden')
			var button = $(e.target)
			window.setTimeout(function() {
				button.text(button.text() === 'show more' ? 'show less' : 'show more')
			}, 300)
		}


	})

})