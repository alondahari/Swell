define([
	'backbone',
	'jade',
	'text!templates/view-rating.jade'
], function(Backbone, jade, template){

	return Backbone.View.extend({

		className: 'row',

		template: jade.compile(template),

		initialize: function(){
			var view = this
			this.model.fetch({success: function (model, res) {
				console.log(res)
				_.extend(view.attributes, res)
				view.render()
				if (view.attributes.fieldName === 'wind') {
					view.$('.rating-value').text(view.formatWindValue(view.attributes.average))
				}
			}})


		},

		render: function(){
			console.log(this)
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