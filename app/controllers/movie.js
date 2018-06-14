var Movie = require('../models/movie')
var Category = require('../models/category')
var Comment = require('../models/comment')
var _ = require('underscore')
var fs = require('fs')
var path = require('path')

exports.detail = function(req,res) {
	var id = req.params.id
	Movie.update({_id:id},{$inc:{pv:1}},function(err) {
		if(err) {
			console.log(err)
		}
	})
	Movie.findById(id,function(err,movie) {
		Comment
			.find({movie:id})
			.populate('from','name')
			.populate('reply.from reply.to','name')
			.exec(function(err,comments) {
				res.render('detail', {
					title:'movie 详情页',
					movie:movie,
					comments:comments
				})
			})
	})
	
}
exports.new = function(req,res) {
	Category.find({},function(err,categories) {
		res.render('admin', {
		title:'movie 后台录入页',
			movie:{},
			categories:categories,
		})
	})
}
exports.update = function(req,res) {
	var id =  req.params.id
	if(id) {
		Movie.findById(id,function(err,movie) {
			Category.find({},function(err,categories) {
				res.render('admin', {
				title:'movie 后台录入页',
					movie:movie,
					categories:categories,
				})
			})
		})
	}
}

//admin poster
exports.savePoster = function(req,res,next) {
	var posterData = req.files.uploadPoster
	var filePath = posterData.path
	var originalFilename = posterData.originalFilename
	if(originalFilename) {
		fs.readFile(filePath, function(err,data) {
			var timestamp = Date.now()
			var type = posterData.type.split('/')[1]
			var poster = timestamp + '.' + type
			var newPath = path.join(__dirname,'../../','/public/upload/' + poster)

			console.log(newPath)
			fs.writeFile(newPath,data,function(err){
				req.poster = poster
				next()
			})
		})
	}else{
		next()
	}
}

exports.save = function(req,res) {
	var id = req.body.movie._id
	var movieObj = req.body.movie
	if(req.poster) {
		movieObj.poster = req.poster
	}

	if(id) {
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
		_movie = new Movie(movieObj)

		var categortId = movieObj.category
		var categortName = movieObj.categoryName

		console.log(categortId,categortName)

		_movie.save(function(err,data) {
			if(err) {
				console.log(err)
			}

			if(categortId) {
				Category.findById(categortId,function(err,category) {

					category.movies.push(data._id)

					category.save(function(err,category) {
						res.redirect('/admin/list')
					})
				})
			} else if(categortName) {
				var category = new Category({
					name:categortName,
					movies:[data._id]
				})

				category.save(function(err,category) {
					data.category = category._id

					data.save(function(err,movie) {
						if(err) {
							console.log(err)
						}

						res.redirect('/admin/list')
					})
				})
			}
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