var User = require('../models/user')

exports.showSignin = function(req, res) {
	res.render('signin',{
		title:'登录页面'
	})
}

exports.showSignup = function(req, res) {
	res.render('signup',{
		title:'注册页面'
	})
}

exports.signup = function(req, res) {
	var _user = req.body.user

	User.find({name:_user.name}, function(err,user) {
		if(err){
			console.log(err)
		}
		console.log(user)
		if(user[0]){
			return res.redirect('/signin')
		}else {
			var user = new User(_user)
			user.save(function(err,user) {
				if(err) {
					console.log(err)
				}

				res.redirect('/')
			})	
		}
	})
}

exports.signin = function(req, res) {
	var _user = req.body.user
	var name = _user.name
	var password = _user.password

	User.findOne({name:name}, function(err,user) {
		if(err) {
			console.log(err)
		}

		if(!user) {
			return res.redirect('/signup')
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
				return res.redirect('/signin')
			}
		})
	})
}

exports.logout = function(req, res) {
	delete req.session.user
	// delete app.locals.user
	res.redirect('/')
}

exports.userlist = function(req,res) {
	User.fetch(function(err,users) {
		if(err) {
			console.log(err)
		}
		res.render('userlist', {
			title:'movie 用户列表页',
			users:users
		})
	})
}

exports.signinRequired = function(req,res,next) {
	var user = req.session.user

	if(!user) {
		return res.redirect('/signin')
	}

	next()
}

exports.adminRequired = function(req,res,next) {
	var user = req.session.user
	console.log(user.role)
	if(user.role <= 10 || !user.role) {
		return res.redirect('/signin')
	}

	next()
}



/*
	user/signup/:userid
 	req.params.userid
		
	user/signup/111?userid=1112
	req.query.userid

	post传参
	req.body.userid

	req.param('userid')全部都能取到。取值顺序先路径、再body、最后query
*/