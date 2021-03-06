var express = require('express');
var path = require('path');//处理路径的 join
var favicon = require('serve-favicon');//收藏夹图标
var logger = require('morgan');//记录日志
//cookie解析中间件 req.cookies
var cookieParser = require('cookie-parser');
//解析请求体的 req.body
var bodyParser = require('body-parser');
//路由
var routes = require('./routes/index');
var user = require('./routes/user');
var article = require('./routes/article');
var app = express();

//设置模板引擎
//设置模板的存放目录
app.set('views', path.join(__dirname, 'views'));
//设置模板引擎
app.set('view engine', 'html');
app.engine('.html',require('ejs').__express);

// uncomment after placing your favicon in /public
//当你在public目录下放置了收藏夹图标后可以取消此注释
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
//记录访问日志的
app.use(logger('tiny'));//dev是一种日志格式
app.use(bodyParser.json());//处理JSON请求体
app.use(bodyParser.urlencoded({ extended: false }));//处理表单序列化 urlencoded请求体
app.use(cookieParser());//处理cookie
//处理静态文件
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);//指定路由
app.use('/user', user);//指定用户路由
app.use('/article', article);//指定文章的路由

// catch 404 and forward to error handler
// 捕获404错误并转向错误处理中间件
app.use(function(req, res, next) {
  var err = new Error('Not Found');//构建ERROR对象
  err.status = 404;//设置响应码
  next(err);//向下传递
});

// error handlers
//错误处理
// development error handler
// will print stacktrace
//开发错误处理的时候将要打印堆栈信息
//env是通过express读取环境变量中的NODE_ENV变量来设置到app 中去的
console.log('env',app.get('env'));
// product
if (app.get('env') === 'development') {
  // 通过中间件函数的参数数量来判断什么是错误处理中间件
  //如果有4个参数就是错误处理中间件
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
//生产环境 线上正式环境 错误处理
//不向用户暴露堆栈信息
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
