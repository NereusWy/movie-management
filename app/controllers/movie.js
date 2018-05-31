var Movie = require('../models/movie')
var _ = require('underscore')

exports.detail = function(req,res) {
	var id = req.params.id
	Movie.findById(id,function(err,movie) {
		res.render('detail', {
			title:'movie 详情页',
			movie:movie
		})
	})
	
}
exports.new = function(req,res) {
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
}
exports.update = function(req,res) {
	var id =  req.params.id
	if(id) {
		Movie.findById(id,function(err,movie) {
			res.render('admin',{
				title:'movie 后台更新页',
				movie:movie
			})
		})
	}
}

exports.save = function(req,res) {
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
}

exports.list = function(req,res) {
	Movie.fetch(function(err,movies) {
		if(err) {
			console.log(err)
		}
		res.render('list', {
			title:'movie 列表页',
			movies:movies
		})
	})
}
exports.del = function(req,res) {
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
}