var kv = require("filekvdb")
  , config = require('./config.js').config;


exports.getDBTableByK = getDBTableByK = function (DB, table, K, callBack) {
  kv.root('.'+config.kvdb);
  kv.DB(DB);
  kv.Table(table);
  kv.has(K,function(has) {
    if( has ) {
      callBack(JSON.parse(kv.get(K)));
    } else {
      console.log(DB+":"+table+":"+K+"  noexist");
      callBack();
    }
  });
};
  
exports.getUserByName = function (name, callBack) {
  return getDBTableByK( config.userdb,'password',name,callBack ); 
};

exports.getConfigByName = function (name, callBack) {
  return getDBTableByK( config.webdb,config.config_table,name,callBack ); 
};

