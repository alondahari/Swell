var express = require('express')
var app = module.exports = express()
var bodyParser = require('body-parser')
var ctrl = require('./controllers/ctrl.js')
var cookieParser = require('cookie-parser')
var expressSession = require('express-session')
var passport = require('passport')


app.set('view engine', 'jade')
app.set('views', __dirname + '/views')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))
app.use(expressSession({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(express.static(__dirname + '/app'))

app.get('/seed', ctrl.seed)

app.post('/login', ctrl.passportLogin)
app.post('/signup', ctrl.passportSignup)

app.get('/googleMaps', ctrl.getMaps)

app.get('/locations', ctrl.getLocations)

app.get('/ratings/:id', ctrl.getRatings)
app.post('/ratings', ctrl.setRating)
app.put('/ratings', ctrl.setRating)

var server = app.listen(process.env.PORT || 7707, function() {
	console.log('Express server listening on port ' + server.address().port)
})


