var Movie = require('../models/movie')

//index page
exports.index = function(req,res) {
	Movie.fetch(function(err,movies) {
		if(err) {
			console.log(err)
		}

		res.render('index', {
			title:'movie 首页',
			movies:movies
		})
	})
}