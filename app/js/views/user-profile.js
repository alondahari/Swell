define([
	'backbone',
	'jade',
	'models/setting',
	'views/rate-field',
	'text!templates/user-profile.jade'
], function(Backbone, jade, Setting, RateField, template){

	return Backbone.View.extend({

		el: $('.wrapper'),

		template: jade.compile(template),

		initialize: function(){
			this.render()

		},

		render: function(){
			this.$el.html(this.template())
			var setting = new Setting({ 
				header: 'Ignore ratings older than',
				value: 6,
				unit: 'hours',
				max: 12,
				min: 2
			})
			this.$('.setting-sliders').append(new RateField({model: setting}).$el)
		}


	})

})