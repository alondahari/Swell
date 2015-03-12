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
    }
  },
  paths: {
    jade: '../node_modules/jade/jade',
    jquery: '../bower_components/jquery/dist/jquery',
    underscore: '../bower_components/underscore/underscore',
    backbone: '../bower_components/backbone/backbone',
    text: '../bower_components/requirejs-text/text',
    moment: '../bower_components/moment/moment',
    slider: '../bower_components/seiyria-bootstrap-slider/js/bootstrap-slider',
    typehead: '../bower_components/typeahead.js/dist/typeahead.bundle'
  }
})

require([
  'backbone',
  'routers/router',
  'models/user'
  ], function(Backbone, Router, User){
    // check for loged in user
    var user = new User()
    user.fetch({success: function(model, res){
      new Router().user = res
      Backbone.history.start()
    }})

})