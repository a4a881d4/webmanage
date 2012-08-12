
/*
 * GET home page.
 */

var config = require('../config.js').config;
var kv = require('filekvdb');
var md5 = require('../lib/util.js').md5;
var storage = require('../storage.js');

exports.index = function(req, res){
  loginstr = "";
  loginclass = "";
  var module = req.query.m || '03index';
  console.log('require: ' +module);
  storage.getUserByName('_classname', function(className) {
    if( req.session.user ) {
      loginstr += req.session.user.name;
      loginclass += className[req.session.user.uclass]; 
    } else {
      loginstr += '您还没有登录';
      loginclass += className['guest'];
    }
    kv.DB(config.webdb);
    kv.Table(module);
    res.render('index', { main: JSON.parse(kv.get('_main')), loginmsg:loginstr, loginc:loginclass });
  });
  console.log("class name undefined");
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
      V={};
      V.admin = '管理员';
      V.operator = '操作员';
      V.watch = '监测人员';
      V.guest = '过客';
      kv.set('_classname',JSON.stringify(V));
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


