define([
	'backbone',
	'jade',
	'text!templates/view-rating.jade'
], function(Backbone, jade, template){

	return Backbone.View.extend({

		className: 'row',

		template: jade.compile(template),

		initialize: function(){
			console.log(this.model)
			this.model.fetch({success: function () {
				console.log(arguments)
			}})

			this.render()

			if (this.attributes.fieldName === 'wind') {
				this.$('.rating-value').text(this.formatWindValue(this.attributes.value))
			}
		},

		render: function(){
			this.$el.html(this.template(this.attributes))
		},

		formatWindValue: function(val){
			var values = [
				'None (0-3 knots)',
				'Calm (4-9 knots)',
				'Strong (10-20 knots)',
				'High (20-40 knots)',
				'Stormy (40+ knots)'
			]
			return values[val]
		}

	})

})