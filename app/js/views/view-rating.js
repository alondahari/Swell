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
				_.extend(view.attributes.field, res)
				view.attributes.field.average = view.formatText(view.attributes.field.fieldName, view.attributes.field.average)
				view.render()
				
			}})


		},

		render: function(){
			$('.loading-spinner').hide()
			this.$el.html(this.template({field: this.attributes.field, user: this.attributes.user}))
		},

		formatText: function(field, val){
			var formats = {
				wind: [
					'None (0-3 knots)',
					'Calm (4-9 knots)',
					'Strong (10-20 knots)',
					'High (20-40 knots)',
					'Stormy (40+ knots)'
				],
				measurement: [
					'Imperial',
					'Metric'
				],
				current: [
					'No current',
					'Mellow current',
					'Dangerous current'
				],
				experience: [
					'Beginner',
					'Novice',
					'Experienced',
					'World-Class'
				],
				suit: [
					'No',
					'Half',
					'Full'
				]
				
			}
			return formats[field] ? formats[field][val] : val
		}

	})

})