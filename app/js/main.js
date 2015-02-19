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
  'routers/router'
  ], function(Backbone, Router){

  new Router()
  Backbone.history.start()

})

// cordova default snippet for later reference

/* we dont encapsulate this in anonymous function because we will be exposing it to globals anyway. But this is an excepetion */
// var app = {
//   templates: {},
//   initialize: function() {
//     /* we need to call use .bind to redefine `this` context inside app.start otherwise it will be the `global` window  */
//     document.addEventListener('deviceready', app.start.bind(this), false)
//   },
//   start: function(){
//     this.show(app.views.main)
//   },
//   show: function(view){
//     if (this.currentView){
//       this.currentView.stopListening()
//     }
    
//     this.currentView = view.render()
//   }

// }  