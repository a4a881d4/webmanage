var config = require('../config.js').config;
var kv = require('filekvdb');
var md5 = require('./util.js').md5;
var storage = require('../storage.js');


exports.index = function(req, res){
  loginstr = "";
  loginclass = "";
  storage.getUserByName('_classname', function(className) {
    if( req.session.user ) {
      loginstr += req.session.user.name;
      loginclass += className[req.session.user.uclass]; 
    } else {
      loginstr += '您还没有登录';
      loginclass += className['guest'];
    }
    res.render('index', { title: 'Express', loginmsg:loginstr, loginc:loginclass });
  });
  console.log("class name undefined");
};

