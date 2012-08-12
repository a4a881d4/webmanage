
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , http = require('http')
  , config = require('./config.js').config
  , construct = require('./lib/construct.js');

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.cookieParser());
  app.use(express.methodOverride());
  app.use(express.session({ secret : config.session_secret }));
  app.use(require('./routes/admin.js').auth_user);
  app.use(app.router);
});
static_dir = __dirname + '/public';
app.configure('development', function(){
  app.use(express.static(static_dir));
  app.get('/construct',construct.index);
  app.use(express.errorHandler());
});
app.configure('production', function() {
  var one_week = 1000 * 60 * 60 * 24 * 7;
  app.use(express.static(static_dir, {
    maxAge : one_week
  }));
  app.use(express.errorHandler());
  app.set('view cache', true);
});

routes(app);

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
