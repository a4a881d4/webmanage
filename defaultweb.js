if( process.argv[2] == 'backup' ) {
  backup();
}
if( process.argv[2] == 'restore' ) {
  restore();
}
if( process.argv[2] == 'gen' ) {
  gen();
}

function backup() {
  var config = require('./config.js').config;
  var kv = require('filekvdb');
  kv.root('.'+config.kvdb);
  kv.backup({'DB':config.webdb});
}

function restore() {
  var config = require('./config.js').config;
  var kv = require('filekvdb');
  kv.root('.'+config.kvdb);
  kv.hasDB( config.webdb, function(has) {
    if( has ) {
      kv.delDB(config.webdb);
    }  
    kv.restore({'DB':config.webdb});
  });
}

function gen() {
    
  var config = require('./config.js').config;
  var kv = require('filekvdb');
  
  console.log(JSON.stringify(config));
  
  kv.root('.'+config.kvdb);
  kv.DB(config.webdb);
  kv.newTable('02mode');
  kv.Table('02mode');
  kv.set('_name','基站配置');
  var bandwidth = {name:'带宽设置',cmd:'bandwidth'};
  kv.set('bandwidth',JSON.stringify(bandwidth));
  var markdown = "\
    Now is the winter of our discontent\
  Made glorious summer by this sun of York;\
  And all the clouds that lour'd upon our house\
  In the deep bosom of the ocean buried.\
  Now are our brows bound with victorious wreaths;\
  Our bruised arms hung up for monuments;\
  Our stern alarums changed to merry meetings,\
  Our dreadful marches to delightful measures.\
  Grim-visaged war hath smooth'd his wrinkled front;\
  And now, instead of mounting barded steeds\
  To fright the souls of fearful adversaries,\
  He capers nimbly in a lady's chamber\
  To the lascivious pleasing of a lute.\
  But I, that am not shaped for sportive tricks,\
  Nor made to court an amorous looking-glass;\
  I, that am rudely stamp'd, and want love's majesty\
  To strut before a wanton ambling nymph;\
  I, that am curtail'd of this fair proportion,\
  ";
  var V={};
  V.content = markdown;
  V.title = '基站配置';
  kv.set('_main',JSON.stringify(V));
  kv.newTable('03index');
  kv.Table('03index');
  kv.set('_name','首页');
  V.title = '首页';
  kv.set('_main',JSON.stringify(V));
  kv.newTable(config.config_table);
  kv.Table(config.config_table);
  V={};
  V.admin = '管理员';
  V.operator = '操作员';
  V.watch = '监测人员';
  V.guest = '过客';
  kv.set('_classname',JSON.stringify(V));
};