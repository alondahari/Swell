define([
	'backbone',
	'handlebars',
	'text!templates/location.html',
	'text!templates/location-select.html'
], function(Backbone, handlebars, template, selectTemplate){
	'use strict';

	return Backbone.View.extend({
		el: $('.container'),

		template: handlebars.compile(template),
		templateSelects: handlebars.compile(selectTemplate),

		events: {
			// @refactor: combine into one event handler
			// @refactor: capitalize field categories
			'change .country-select': 'countryChange',
			'change .county-select': 'countyChange',
			'change .spot-select': 'spotChange'
		},

		initialize: function(){
			console.log(this.collection);
			this.country = _.unique(this.collection.pluck('country'));
			this.render();

		},

		render: function(){
			this.$el.html(this.template());
			this.renderField(['country', 'county', 'spot']);
		},

		renderField: function(fields){
			_.each(fields, function(field){
				this.$el.find('.' + field + '-select')
					.html(this.renderSelect(field, this[field]))
					// @refactor: move to template
					.prop('disabled', !(this[field] && this[field].length) )
					.focus()
					// trigger change to disable button when country change 
					// doesn't trigger on it's own?
					.trigger('change');
			}, this);
		},

		renderSelect: function(category, arr, spotId){
			return this.templateSelects({category: category, arr: arr, spotId: spotId});
		},

		countryChange: function(e){
			var country = $.trim($(e.currentTarget).find(':selected').val());
			var county = this.collection.where({country: country});
			this.county = _.chain(county)
				.map(function(val) {
					return val.attributes.county_name;
				})
				.unique().value();

				this.renderField(['county', 'spot']);
		},

		countyChange: function(e){
			var county = $.trim($(e.currentTarget).find(':selected').val());
			var spot = this.collection.where({county_name: county});
			this.spot = _.chain(spot)
				.map(function(val) {
					return val.attributes.spot_name;
				})
				.unique().value();

			this.renderField(['spot']);
		},

		spotChange: function(e){
			// would return more than one spot if more than one exists!!
			// need to pass spot_id to the option fields
			var spotName = $(e.currentTarget).find(':selected').val();

			$('.button-submit')
				.toggleClass('disabled', !spotName)
				.attr('href', '#spot/' + spotName);

		}


	});

});