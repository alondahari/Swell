/*global require*/
'use strict';

// Require.js allows us to configure shortcut alias
require.config({
  // The shim config allows us to configure dependencies for

  // scripts that do not call define() to register a module
  shim: {
    underscore: {
      exports: '_'
    },
    backbone: {
      deps: [
        'underscore',
        'jquery'
      ],
      exports: 'Backbone'
    },
    localStorage: {
      deps: ['backbone'],
      exports: 'Store'
    }
  },
  paths: {
    handlebars: '../../bower_components/handlebars/handlebars',
    jquery: '../../bower_components/jquery/dist/jquery',
    underscore: '../../bower_components/underscore/underscore',
    backbone: '../../bower_components/backbone/backbone',
    localStorage: '../../bower_components/backbone.localStorage/backbone.localStorage',
    text: '../../bower_components/requirejs-text/text',
    rangeSlider: '../../bower_components/rangeslider.js/dist/rangeslider',
  }
});

require([
  'backbone',
  '../test/spec/router'
  ],
  function(backbone, spec ){
    window.executeTests();

});