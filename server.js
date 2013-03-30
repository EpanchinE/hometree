
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path')
  , faye = require('faye')
  , os   = require("os")
  , crypto = require('crypto');

var app = express();
var bayeux = new faye.NodeAdapter({mount: '/faye', timeout: 45});
bayeux.listen(9090);

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser('your secret here'));
  app.use(express.session());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', function(req, res){
  var hmac       = crypto.createHmac('sha256', 'your secret key');
  var auth_token = hmac.update('the user ID').digest('hex');

  res.render('index', {
    title: 'My App',
    auth_token: auth_token
  });
});
app.get('/users', user.list);

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
