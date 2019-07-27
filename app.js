// DECLARATIONS

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
//var session = require('express-session');
var cookieSession = require('cookie-session')
var crypto = require('crypto');

var signinRouter = require('./routes/signin');
var serviceRouter = require('./routes/service');
var dashboardRouter = require('./routes/dashboard');
var projectsRouter = require('./routes/projects');
var usersRouter = require('./routes/users');
var docsRouter = require('./routes/docs');
var consoleRouter = require('./routes/console');
var scriptsRouter = require('./routes/scripts');

var app = express();

// SETTING UP

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.set('trust proxy', true);

// UTILITY FUNCTIONS

function allowip(ip) {
    var ips = ip.split(':').pop();
    return (ips == "10.5.112.3" ? true : false);
}

function md5(str){
    return crypto.createHash('md5').update(str).digest('hex');
}

// MIDDLEWARES

// var expiryDate = new Date(Date.now() + 60 * 60 * 1000) // 1 hour

// var sess = {
//     secret: 'cjVLpjVjm35S4qkWHhT2pT8D5SAGmStq486BkFgUsz5RjfYQFS5paAwRCFgh8qZC',
//     cookie: {expires: expiryDate},
//     resave: true,
//     saveUninitialized: false
// }

// if (app.get('env') === 'production') {
//     app.set('trust proxy', 1) // trust first proxy
//     sess.cookie.secure = false // serve secure cookies
// }

// app.use(session(sess));

/*
app.use(function(req, res, next) {
    if (allowip(req.ip))
        next();
    else
        res.status(403).end('forbidden');
    //res.send(req.ip);
});
*/

app.use(cookieSession({
  name: 'ma4aTapAWKXzxLY9',
  keys: ['cjVLpjVjm35S4qkWHhT2pT8D5SAGmStq486BkFgUsz5RjfYQFS5paAwRCFgh8qZC', 'NnfGXQxAD7ABhDwq9T3oUWyPFxTFU4wCaykcXzDzXc3HKQwwhDDtWtnQjeJMfru7'],
  secure: false
}))

//INCLUDES

app.locals.lang = require('./inc/lang');

// LANGS

app.use(function (req, res, next) {
    if(req.session.lang == null)
    {
        req.session.lang = 'en';
    }
    if(req.session.instance == null)
    {
        req.session.instance = {};
        req.session.instance.bsrl_path = "http://localhost:8000/";
    }
    next();
});

// REDIRECTIONS

app.get('/', function (req, res) {
    res.redirect('/dashboard');
});
app.get('/signout', function (req, res) {
    req.session.fingerprint = null;
    req.session.email = null;
    res.redirect('/signin');
});

// ROUTING

app.use('/service', serviceRouter);
app.use('/signin', signinRouter);
app.use('/dashboard', dashboardRouter);
app.use('/projects', projectsRouter);
app.use('/users', usersRouter);
app.use('/docs', docsRouter);
app.use('/console', consoleRouter);
app.use('/scripts', scriptsRouter);

// ERRORS

app.use(function (req, res, next) {
    next(createError(404));
});

app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

// EXPORT

module.exports = app;