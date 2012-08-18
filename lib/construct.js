var config = require('../config.js').config;
var kv = require('filekvdb');
var md5 = require('./util.js').md5;
var storage = require('../storage.js');


exports.index = function(req, res){
  storage.getConfigByName('_classname', function(className) {
    loginstr = "您还没有登录";
    loginclass = '过客';
    if( req.session ) {
      if( req.session.user ) {
        loginstr = req.session.user.name;
        if( className ) {
          loginclass = className[req.session.user.uclass];
        } else {
          loginclass = req.session.user.uclass;
        }
      } 
    } 
    res.render('construct', { title: '构建菜单', loginmsg:loginstr, loginc:loginclass });
  });
};

exports.menu = function( req, res ) {
  if(req.method == "GET") {
    res.writeHead(200,{'Content-Type': 'text/html; charset=utf-8'});
    var ret = storage.getMenu();
    res.write(JSON.stringify(ret));
    res.end();
  } else {
    var V = req.body;
    if( V.method == 'modify' || V.method == 'new' ) {
      var menu = {};
      menu.id = V.id;
      menu.name = V.name;
      menu.auth = V.auth;
      if( V.method == 'modify' ) {
        storage.setMenu( menu );
      } else {
        storage.setNewMenu( menu );
      }
      
    } else if( V.method == 'delete' ) {
      var menu = {};
      menu.id = V.id;
      storage.delMenu( menu );
    }
    res.redirect('/construct');
    res.end();
  }
};

exports.submenu = function( req, res ) {
  res.writeHead(200,{'Content-Type': 'text/html; charset=utf-8'});
  var ret = storage.getSubMenu(req.query.id,res);
};

exports.del = function( req, res ) {
  console.log( JSON.stringify( req.query ) );
  storage.delP( req.query );
  res.redirect('/construct');
  res.end();
};
exports.add = function( req, res ) {
  console.log( JSON.stringify( req.query ) );
  storage.addP( req.query );
  res.redirect('/construct');
  res.end();
};
exports.backup = function( req, res ) {
  storage.backup( req.query.m );
  res.redirect('/construct');
  res.end();
};
exports.restore = function( req, res ) {
  storage.restore( req.query.m );
  res.redirect('/construct');
  res.end();
};
