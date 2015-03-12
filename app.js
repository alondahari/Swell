var express = require('express')
var app = module.exports = express()
var bodyParser = require('body-parser')
var cookieParser = require('cookie-parser')
var expressSession = require('express-session')
var passport = require('passport')
var mongoose = require('mongoose')

var indexCtrl = require('./controllers/index')
var authenticationCtrl = require('./controllers/authentication')
var passportConfig = require('./config/passport')

console.log('enviroment:', process.env.NODE_ENV)
if (process.env.NODE_ENV === 'development') {
	mongoose.connect('mongodb://localhost/swell')
} else {
	mongoose.connect(process.env.MONGOLAB_URI)
}
app.set('view engine', 'jade')
app.use(express.static(__dirname + '/app'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))
app.use(expressSession({
    secret: 'e02590862ef7d41a533c5ad3d8ce67621a0a23beb3b825f5a55c974786b1f9fb',
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())

app.get('/seed', indexCtrl.seed)
app.get('/', indexCtrl.index)

app.get('/user', authenticationCtrl.user)
app.post('/login', authenticationCtrl.login)
app.post('/signup', authenticationCtrl.signup)
app.use('/logout', authenticationCtrl.logout)

app.get('/googleMaps', indexCtrl.getMaps)

app.get('/locations', indexCtrl.getLocations)

app.get('/ratings/:id', indexCtrl.getRatings)
app.post('/ratings', indexCtrl.setRating)
app.put('/ratings', indexCtrl.setRating)


// We can prevent unauthorized access to any route handler defined after this


var server = app.listen(process.env.PORT || 7707, function() {
	console.log('Express server listening on port ' + server.address().port)
})


