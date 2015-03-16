define([
	'backbone',
	'jade',
	'views/avatar',
	'views/view-rating',
	'views/user-comment-get',
	'models/rating',
	'text!templates/view.jade',
	'collections/user-comments'
], function(Backbone, jade, Avatar, ViewRating, CommentView, Rating, template, UserComments){

	return Backbone.View.extend({

		template: jade.compile(template),

		fields: {
			overall: {
				header: 'Overall Wave Quality',
				unit: '/ 10',
				fieldName: 'overall'
			},
			waveHeight: {
				header: 'Wave Height',
				unit: 'ft',
				fieldName: 'waveHeight'
			},
			wind: {
				header: 'Wind',
				fieldName: 'wind'
			},
			crowd: {
				header: 'Crowd',
				unit: 'surfers',
				fieldName: 'crowd'
			}
		},

		initialize: function(){
			this.render()
		},

		render: function(){

			$('.loading-spinner').hide()
			this.$el.html(this.template({header: this.attributes.title}))
			// not setting .wrapper as $el to keep all events within scope
			$('.wrapper').html(this.el)

			this.renderFields()

			this.$('.user').html(new Avatar({model: this.attributes.user}).$el)
			this.$('a.rate-nav').attr('href', '#spot/' + this.attributes.title + '/' + this.id)

			this.renderComments()
		},

		/**
		 * render the rating fields with a different template
		 * refactor: make into a seperate view
		 */
		renderFields: function(){

			_.each(this.fields, function(field){
				var rating = new Rating()
				rating.url = backendPath + '/rating/' + field.fieldName + '/' + this.id
				var rateField = new ViewRating({model: rating, attributes: field})
				this.$('.ratings').append(rateField.$el)
				
			}, this)
		},

		renderComments: function(){
			var view = this
			var comments = new UserComments()
			comments.url = '/comments/' + this.id
			comments.fetch({success: function (model, res) {
				console.log(res)
				_.each(res, function (comment) {
					view.$('.comments').append(new CommentView({ model: comment }))
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
		}


	})

})