define([
	'backbone',
	'jade',
	'text!templates/view-rating.jade',
	'utils/helpers'
], function(Backbone, jade, template, helpers){

	return Backbone.View.extend({

		className: 'row',

		template: jade.compile(template),

		initialize: function(){

			var view = this
			this.model.fetch({success: function (model, res) {
				_.extend(view.attributes.field, res)
				view.attributes.field.average = helpers.formatText(view.attributes.field.fieldName, view.attributes.field.average)
				view.render()
				
			}})
		},

		render: function(){
			$('.loading-logo').hide()
			this.$el.html(this.template({field: this.attributes.field, user: this.attributes.user}))
		}

	})

})