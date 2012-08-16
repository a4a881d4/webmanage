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

exports.getMenu = function() {
  var menus = [];
  kv.root('.'+config.kvdb);
  kv.DB(config.webdb);
  var items = kv.listTable();
  var k = 0;
  for( item in items ) {
    if( items[item].indexOf('_')==-1 ) {
      kv.Table(items[item]);
      menus[k]={};
      var str = kv.get('_name').toString();
      menus[k]=JSON.parse(str);
      menus[k].id = items[item];
      k++;
    }
  }
  return jssort(menus);
};

jssort = function( arrays ) {
	arrays.sort( function cmp(a,b) { return a.xindex>b.xindex; } );
	return arrays;
};