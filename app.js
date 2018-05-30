var express = require('express')
var path = require('path')
var mongoose = require('mongoose')
var mongooseStore = require('connect-mongo')(express)
var bodyParser = require('body-parser')

var port = process.env.PORT || 3000
var app = express()
var dbUrl = 'mongodb://localhost/movie'

mongoose.connect(dbUrl)

app.set('views','./views/pages')
app.set('view engine', 'jade')
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.cookieParser());
app.use(express.session({
	secret:'movie',
	store:new mongooseStore({
		url:dbUrl,
		collection:'sessions'
	})
}));

app.use(express.static(path.join(__dirname,'public')))
app.locals.moment = require('moment')

if('development' === app.get('env')) {
	app.set('showStackError',true)
	app.use(express.logger(':method :url :status'))
	app.locals.pretty = true
	mongoose.set('debug',true)
}

require('./config/routes')(app)

app.listen(port)

console.log('movie started on port ' + port)


