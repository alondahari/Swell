define([
	'backbone',
	'text!templates/location.html',
	'text!templates/location-select.html'
], function(Backbone, template, selectTemplate){
	'use strict';

	var SearchBarView = Backbone.View.extend({
		el: $('body'),

		template: _.template(template),
		templateSelects: _.template(selectTemplate),

		events: {
			// @refactor: combine into one event handler
			'change .country-select': 'countryChanged',
			'change .county-select': 'countyChanged'
		},

		initialize: function(){
			this.country = _.unique(this.model.pluck('country'));
			this.render();
		},

		render: function(){
			// @refactor: re-render just the selects on change
			this.$el.html(this.template());
			this.renderField('country');
			this.renderField('county');
			this.renderField('spot');
		},

		renderSelect: function(category, arr){
			return this.templateSelects({category: category, arr: arr});
		},

		renderField: function(field){
			this.$el.find('.' + field + '-select').html(this.renderSelect(field, this[field]));
		},

		countryChanged: function(e){
			var country = $.trim($(e.currentTarget).find(':selected').val());
			var county = this.model.where({country: country});
			this.county = _.chain(county)
				.map(function(val) {
					return val.attributes.county_name;
				})
				.unique().value();

				this.renderField('county');
				this.renderField('spot');
		},

		countyChanged: function(e){
			var county = $.trim($(e.currentTarget).find(':selected').val());
			var spot = this.model.where({county_name: county});
			this.spot = _.chain(spot)
				.map(function(val) {
					return val.attributes.spot_name;
				})
				.unique().value();

			this.renderField('spot');
		}


	});
	return SearchBarView;
});