var express = require('express');
var bodyParser = require('body-parser');
var ctrl = require('./controllers/ctrl.js');

var app = express();
app.set('view engine', 'jade');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/app'));
app.use(bodyParser.urlencoded({extended: false}));

app.get('/locations', ctrl.getLocations);

var server = app.listen(7707, function() {
	console.log('Express server listening on port ' + server.address().port);
});
