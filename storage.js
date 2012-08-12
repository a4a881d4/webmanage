var kv = require("filekvdb")
  , config = require('./config.js').config;

exports.getUserByName = function (name, callBack) {
  kv.root('.'+config.kvdb);
  kv.DB(config.userdb);
  kv.Table('password');
  kv.has(name,function(has) {
    if( has ) {
      callBack(JSON.parse(kv.get(name)));
    } else {
      console.log("user:  "+name+"  noexist");
    }
  });
};
  

