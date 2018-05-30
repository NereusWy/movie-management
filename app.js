var express = require('express')
var path = require('path')
var mongoose = require('mongoose')
var mongooseStore = require('connect-mongo')(express)
var _ = require('underscore')
var Movie = require('./models/movie')
var User = require('./models/user')
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
app.listen(port)

console.log('movie started on port ' + port)

app.get('/',function(req,res) {
	console.log(req.session.user)

	var _user = req.session.user 

	if(_user){
		app.locals.user = _user
	}

	Movie.fetch(function(err,movies) {
		if(err) {
			console.log(err)
		}
		res.render('index', {
			title:'movie 首页',
			movies:movies
		})
	})
})

app.get('/admin/list',function(req,res) {
	Movie.fetch(function(err,movies) {
		if(err) {
			console.log(err)
		}
		res.render('list', {
			title:'movie 列表页',
			movies:movies
		})
	})
})

app.get('/movie/:id',function(req,res) {
	var id = req.params.id
	Movie.findById(id,function(err,movie) {
		res.render('detail', {
			title:'movie 详情页',
			movie:movie
		})
	})
	
})

app.get('/admin/movie',function(req,res) {
	res.render('admin', {
		title:'movie 后台录入页',
		movie:{
			doctor:'',
			country:'',
			title:'',
			year:'',
			poster:'',
			language:'',
			flash:'',
			summary:''
		}
	})
})

app.get('/admin/update/:id',function(req,res) {
	var id =  req.params.id
	if(id) {
		Movie.findById(id,function(err,movie) {
			res.render('admin',{
				title:'movie 后台更新页',
				movie:movie
			})
		})
	}
})

app.post('/admin/movie/new',function(req,res) {
	var id = req.body.movie._id
	var movieObj = req.body.movie
	if(id !== 'undefined') {
		Movie.findById(id,function(err,movie) {
			if(err) {
				console.log(err)
			}

			_movie = _.extend(movie,movieObj)
			_movie.save(function(err,data) {
				if(err) {
					console.log(err)
				}
				res.redirect('/admin/list')
			})
		})
	}else{
		_movie = new Movie({
			'doctor':movieObj.doctor,
			'country':movieObj.country,
			'title':movieObj.title,
			'year':movieObj.year,
			'poster':movieObj.poster,
			'language':movieObj.language,
			'flash':movieObj.flash,
			'summary':movieObj.summary
		})
		_movie.save(function(err,data) {
			if(err) {
				console.log(err)
			}
			res.redirect('/admin/list')
		})
	}
})

app.delete('/admin/list',function(req,res) {
	var id = req.query.id
	if(id) {
		Movie.remove({_id:id}, function(err,movie) {
			if(err) {
				console.log(err)
			}else{
				res.json({success:1})
			}
			
		})
	}
})
	
app.get('/admin/userlist',function(req,res) {
	User.fetch(function(err,users) {
		if(err) {
			console.log(err)
		}
		res.render('userlist', {
			title:'movie 用户列表页',
			users:users
		})
	})
})

/*
	user/signup/:userid
 	req.params.userid
	
	user/signup/111?userid=1112
	req.query.userid

	post传参
	req.body.userid

	req.param('userid')全部都能取到。取值顺序先路径、再body、最后query
*/
app.post('/user/signup', function(req, res) {
	var _user = req.body.user

	User.find({name:_user.name}, function(err,user) {
		if(err){
			console.log(err)
		}
		if(user[0]){
			return res.redirect('/')
		}else {
			var user = new User(_user)
			user.save(function(err,user) {
				if(err) {
					console.log(err)
				}

				res.redirect('/admin/userlist')
			})	
		}
	})
})

app.post('/user/signin', function(req, res) {
	var _user = req.body.user
	var name = _user.name
	var password = _user.password

	User.findOne({name:name}, function(err,user) {
		if(err) {
			console.log(err)
		}

		if(!user) {
			return redirerct('/')
		}

		user.comparePassword(password, function(err,isMatch) {
			if(err) {
				console.log(err)
			}

			if(isMatch) {
				req.session.user = user

				console.log('password is matched')
				return res.redirect('/')
			}else{
				console.log('password is not matched')
			}
		})
	})
})

app.get('/logout', function(req, res) {
	delete req.session.user
	delete app.locals.user
	res.redirect('/')
})


