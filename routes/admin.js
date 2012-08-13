
var storage = require('../storage.js');
var config = require('../config.js').config;
var util = require('../lib/util.js');


exports.auth_user = function(req, res, next) {
//  console.log("cookies:"+JSON.stringify(req.cookies));
  if (req.session.user) {
    return next();
  }
  else {
    var cookie = req.cookies[config.auth_cookie_name];
    if (!cookie)
      return next();

    var auth_token = util.decrypt(cookie, config.session_secret);
    var auth = auth_token.split('\t');
    var user_name = auth[0];
 //   console.log(JSON.stringify(auth));
    storage.getUserByName(user_name, function(user){
      if (user) {
        req.session.user = user;
        return next();
      }
      else
        req.session.destroy();
        return next();
      }
    );
  }
};

exports.logout = function(req, res, next) {
  req.session.destroy();
  res.clearCookie(config.auth_cookie_name, {
    path : '/'
  });
  res.redirect('/');
};

exports.login = function(req,res) {
  if(req.method == "GET") {
    res.render("login",{error:''});
  } else if(req.method == "POST") {
    var name = req.body.name.trim();
    var pass = req.body.pass.trim();
    if(name ==''||pass == ''){
      res.render('login', {
        error : '信息不完整。'
      });
      return;
    }

    storage.getUserByName(name, function(user){
      pass = util.md5(pass)
      if(user) {
        if(user.pass != pass){
          console.log("pass:"+pass+"-"+user.pass);
          res.render('login', {
            error : '密码错误。'
          });
          return;
        } else {
          gen_session(user, res);
          res.redirect('/');  
        }
      }
      res.render('login', {
        error : '用户不存在。'
      });
      return;
    });
  }
};

/** private function */

function gen_session(user, res) {
  var auth_token = util.encrypt(user.name + '\t' + user.pass , config.session_secret);
  res.cookie(config.auth_cookie_name, auth_token, {
    path : '/',
    maxAge : 1000 * 60 * 60 * 24 * 7
  }); 
};

