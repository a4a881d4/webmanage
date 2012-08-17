var config = require('../config.js').config;
var kv = require('filekvdb');
var md5 = require('./util.js').md5;
var storage = require('../storage.js');


exports.index = function(req, res){
  storage.getConfigByName('_classname', function(className) {
    loginstr = "您还没有登录";
    loginclass = className['guest'];
    if( req.session ) {
      if( req.session.user ) {
        loginstr = req.session.user.name;
        loginclass = className[req.session.user.uclass];
      } 
    } 
    res.render('construct', { title: '构建菜单', loginmsg:loginstr, loginc:loginclass });
  });
};

exports.menu = function( req, res ) {
  res.writeHead(200,{'Content-Type': 'text/html; charset=utf-8'});
  var ret = storage.getMenu();
  res.write(JSON.stringify(ret));
  res.end();
};

exports.submenu = function( req, res ) {
  res.writeHead(200,{'Content-Type': 'text/html; charset=utf-8'});
  var ret = storage.getSubMenu(req.query.id);
  res.write(JSON.stringify(ret));
  res.end();
};
