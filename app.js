var express = require('express')
var app = module.exports = express()
var bodyParser = require('body-parser')
var cookieParser = require('cookie-parser')
var expressSession = require('express-session')
var passport = require('passport')
var mongoose = require('mongoose')

var indexCtrl = require('./controllers/index')
var ratingsCtrl = require('./controllers/ratings')
var userCtrl = require('./controllers/user')
var passportConfig = require('./config/passport')

console.log('enviroment:', process.env.NODE_ENV)
if (process.env.NODE_ENV === 'development') {
	mongoose.connect('mongodb://localhost/swell')
	app.use(express.static(__dirname + '/app'))
} else {
	mongoose.connect(process.env.MONGOLAB_URI)
	app.use(express.static(__dirname + '/www'))
}


app.use(bodyParser.json({limit: '16mb'}))

app.use(expressSession({
    secret: 'e02590862ef7d41a533c5ad3d8ce67621a0a23beb3b825f5a55c974786b1f9fb',
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())

app.get('/seed', indexCtrl.seed)

app.get('/user', userCtrl.user)
app.post('/user', userCtrl.updateUser)
app.put('/user', userCtrl.updateUser)

app.use('/login', userCtrl.login)
app.use('/signup', userCtrl.signup)
app.use('/logout', userCtrl.logout)

app.get('/googleMaps', indexCtrl.getMaps)

app.get('/locations', indexCtrl.getLocations)

app.get('/rating/:fieldName/:id', ratingsCtrl.getRatings)
app.post('/rating', ratingsCtrl.setRating)
app.put('/rating', ratingsCtrl.setRating)

app.get('/comments/:id', ratingsCtrl.getComments)
app.post('/comments', ratingsCtrl.addComment)
app.put('/comments', ratingsCtrl.updateComment)
app.get('/delete-comment/:id', ratingsCtrl.deleteComment)

app.post('/user-setting', userCtrl.userSetting)


var server = app.listen(process.env.PORT || 7878, function() {
	console.log('Express server listening on port ' + server.address().port)
})


