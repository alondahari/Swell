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

		events: {
			'keydown .field-input': 'changeField',
			'blur .field-input': 'save'
		},

		settings: [
		{ 
			fieldName: 'ignoreRating',
			header: 'Ignore ratings older than',
			value: 6,
			unit: 'hours',
			max: 12,
			min: 2
		},
		{
			fieldName: 'measurement',
			header: 'Measurement system',
			value: 0,
			max: 1
		}
		],

		initialize: function(){
			this.listenTo(this.model, 'sync', this.userUpdate)
			this.render()

		},

		render: function(){
			this.$el.html(this.template({user: this.model.toJSON()}))
			this.settings.forEach(function(setting){
				var field = new Setting(setting)
				this.$('.setting-sliders').append(new RateField({model: field}).$el)
			})
		},

		changeField: function(e){
			if(e.which === 13){
				e.preventDefault()
				$(e.target).blur()
			}
		},

		save: function(e){
			var $target = $(e.target)
			var field = $target.data('field')
			var newValue = $target.text()
			this.model.attributes[field] = newValue
			this.model.url = '/user'
			this.model.save()
		},

		userUpdate: function(){
			console.log(arguments)
		}


	})

})