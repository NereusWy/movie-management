var Index = require('../app/controllers/index')
var User = require('../app/controllers/user')
var Movie = require('../app/controllers/movie')

module.exports = function(app){
	/*
		user/signup/:userid
	 	req.params.userid
		
		user/signup/111?userid=1112
		req.query.userid
		post传参
		req.body.userid
		req.param('userid')全部都能取到。取值顺序先路径、再body、最后query
	*/

	//pre handle user
	app.use(function(req,res,next) {
		var _user = req.session.user 

		app.locals.user = _user

		next()
	})

	//Index
	app.get('/',Index.index)					//网站主页

	//User
	app.get('/signin',User.showSignin)
	app.get('/signup',User.showSignup)
	app.get('/admin/userlist',User.signinRequired, User.adminRequired, User.userlist)	//用户列表页面
	app.post('/user/signup',User.signup)		//用户注册接口
	app.post('/user/signin',User.signin)		//用户登录接口
	app.get('/logout',User.logout)				//用户退出接口
	

	//Movie
	app.get('/movie/:id',Movie.detail)			//详情页面
	app.get('/admin/movie',User.signinRequired, User.adminRequired,Movie.new)			//录入页面
	app.get('/admin/update/:id',User.signinRequired, User.adminRequired,Movie.update)	//录入页面(带数据)更新
	app.post('/admin/movie/new',User.signinRequired, User.adminRequired,Movie.save)		//录入页面提交操作
	app.get('/admin/list',User.signinRequired, User.adminRequired,Movie.list)			//电影列表页面
	app.delete('/admin/list',User.signinRequired, User.adminRequired,Movie.del)			//电影删除页面
}