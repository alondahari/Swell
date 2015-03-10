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

		settings: [
		{ 
			header: 'Ignore ratings older than',
			value: 6,
			unit: 'hours',
			max: 12,
			min: 2
		},
		{
			header: 'Measurement system',
			value: 0,
			max: 1
		}
		],

		initialize: function(){
			this.render()

		},

		render: function(){
			this.$el.html(this.template())
			this.settings.forEach(function(setting){
				var field = new Setting(setting)
				this.$('.setting-sliders').append(new RateField({model: field}).$el)
			})
		}


	})

})