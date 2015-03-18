define([
	'backbone',
	'jade',
	'slider',
	'utils/pubsub',
	'text!templates/rate-field.jade',
	'utils/helpers'
], function(Backbone, jade, slider, pubsub, template, helpers){

	return Backbone.View.extend({

		className: 'row',

		template: jade.compile(template),

		events: {
			'change .rating-input-range': 'updateRatings',
			'click .slider': 'updateRatings'
		},

		initialize: function(){

			this.render()
			// hide defauld slider tooltip
			this.model.set({tooltip: 'hide'})

			if (!this.attributes.user.attributes._id) {
				this.model.set({enabled: false})
			}

			this.slider = this.$('.rating-input-range').slider(this.model.toJSON())
			var value = this.slider.slider('getValue')
			var text = helpers.formatText(this.model.get('fieldName'), value)

			this.$('.rating-value').text(text)
			
		},

		render: function(){
			this.$el.html(this.template(this.model.toJSON()))
		},

		updateRatings: function(){
			if (!this.attributes.user.attributes._id){
				pubsub.trigger('pleaseLoginPulse')
				return false
			} 
			// get value from slider
			var value = this.slider.slider('getValue')

			pubsub.trigger('ratingChanged', {value: value, field: this.model.get('fieldName')})

			// format value if needed
			var text = helpers.formatText(this.model.get('fieldName'), value)

			// set the value in the DOM and add class for visual change feedback
			this.$('.rating-value').text(text).addClass('value-changed')

			// timeout to avoid multiple calls to the server on slider drag
			if (this.timeout) clearTimeout(this.timeout)
			
			this.$('.rating-save').text('Saving...')

			this.timeout = setTimeout(function(view){
				view.timeout = null
				// update model and database
				view.model.save({
					time: Date.now(),
					spotId: view.id,
					userId: view.attributes.user.attributes._id,
					value: value
				}, {success: function(model, data){
					pubsub.trigger('updateUserSettings', model)
					view.$('.rating-save').text('Saved!')

				}, error: function(model, data){
					console.log('error: ', data)
				}})
			}, 1000, this);

		}

	})

})