var express = require('express')
var path = require('path')
var mongoose = require('mongoose')
var _ = require('underscore')
var Movie = require('./models/movie')
var bodyParser = require('body-parser')

var port = process.env.PORT || 3000
var app = express()

mongoose.connect('mongodb://localhost/movie')

app.set('views','./views/pages')
app.set('view engine', 'jade')
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static(path.join(__dirname,'public')))
app.locals.moment = require('moment')
app.listen(port)

console.log('movie started on port ' + port)

app.get('/',function(req,res) {
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
	



