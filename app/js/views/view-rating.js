define([
	'backbone',
	'jade',
	'text!templates/view-rating.jade'
], function(Backbone, jade, template){

	return Backbone.View.extend({

		className: 'row',

		template: jade.compile(template),

		initialize: function(){
			console.log(this.attributes.user)
			var view = this
			this.model.fetch({success: function (model, res) {
				_.extend(view.attributes.field, res)
				view.render()
				if (view.attributes.field.fieldName === 'wind') {
					view.$('.rating-value').text(view.formatWindValue(view.attributes.field.average))
				}
			}})


		},

		render: function(){
			$('.loading-spinner').hide()
			this.$el.html(this.template({field: this.attributes.field, user: this.attributes.user}))
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