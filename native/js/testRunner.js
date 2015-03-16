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
    moment: '../../bower_components/moment/moment',
    slider: '../../bower_components/seiyria-bootstrap-slider/js/bootstrap-slider'
  }
})

require([
  'backbone',
  '/app/test/spec/router.js',
  '/app/test/spec/collections/ratings.js'
  ],
  function(backbone, spec ){
    window.executeTests()

})