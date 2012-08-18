
/*
 * GET home page.
 */

var config = require('../config.js').config;
var kv = require('filekvdb');
var md5 = require('../lib/util.js').md5;
var storage = require('../storage.js');

exports.index = function(req, res){
  loginstr = "";
  loginclass = "过客";
  var m = req.query.m || 'index';
  var s = req.query.s;
  var argv = {loginmsg:loginstr, loginc:loginclass, 'id':module };
  storage.getConfigByName('_classname', function(className) {
    if( req.session ) { 
      if( req.session.user ){
        loginstr += req.session.user.name;
        loginclass += className[req.session.user.uclass]; 
      } 
    }
    if( s ) {
      storage.getDBTableByK( config.webdb,m,req.query.s, function(V) {
        if( V.DB != 'undefined' &&
          V.T != 'undefinded' ) {
            storage.jadeRenderTable( V.DB, V.T, m, s, res,argv );
        }
      });
    } else {
      argv.html="<h1>index</h1>";   
      res.render('index', argv);
    }
  });
};

exports.init = function(req, res){
  kv = require('filekvdb');
  kv.root(__dirname+'/..'+config.kvdb);
  var ret={};
  kv.hasDB(config.userdb, function(has) {
    if( has )  {
      ret['msg']='system already init!!';
    }
    else
    {
      var x = Math.floor(Math.random() * Math.pow(16,4)).toString(16);
      var y = Math.floor(Math.random() * Math.pow(16,4)).toString(16);
      kv.newDB(config.userdb);
      kv.DB(config.userdb);
      kv.newTable('password');
      kv.Table('password');
      username = x+'@jonet';
      var V={"name":username,"pass":md5(y)};
      V['uclass']='admin';
      kv.set(username,JSON.stringify(V));
      ret['msg']='username:'+username+',password:'+y;
    }
    console.log(JSON.stringify(ret)+kv.fn('nobody'));
    res.render('info', ret);
  });
};

exports.clean = function(req, res){
  kv = require('filekvdb');
  kv.root(__dirname+'/..'+config.kvdb);
  kv.hasDB(config.userdb, function(has) {
    if( has ) {
      kv.delDB(config.userdb);
      res.render('info',{ msg:'user DB delete' });
    }
    else {
      res.render('info',{ msg:'user DB no exit' });
    }
  });
};


