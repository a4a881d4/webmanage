var kv = require("filekvdb")
  , config = require('./config.js').config
  , jade = require("jade");
  

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

exports.setMenu = function( menu ) {
  kv.root('.'+config.kvdb);
  kv.DB(config.webdb);
  kv.Table(menu.id);
  kv.set('_name',JSON.stringify(menu));
};
exports.setNewMenu = function( menu ) {
  kv.root('.'+config.kvdb);
  kv.DB(config.webdb);
  kv.newTable(menu.id);
  kv.Table(menu.id);
  kv.set('_name',JSON.stringify(menu));
  var V = {};
  V.title = menu.name;
  V.content = "";
  kv.set('_main',JSON.stringify(V));
};
exports.delMenu = function( menu ) {
  kv.root('.'+config.kvdb);
  kv.DB(config.webdb);
  kv.delTable(menu.id);
};
  
exports.getSubMenu = function(submenu,res) {
  var menus = [];
  kv.root('.'+config.kvdb);
  kv.DB(config.webdb);
  kv.Table(submenu);
  var items = kv.list();
  var k = 0;
  var dict = {};
  menus[k]=JSON.parse(kv.get('_main').toString());
  kv.has('_dict',function( has ) {
    if( has ) {
      dict = JSON.parse(kv.get('_dict')); 
    } else {
      kv.set('_dict',JSON.stringify(dict));
    }
    menus[k].id = '_main';
    menus[k].name = '说明';
    menus[k].dict = dict;
    menus[k].xindex = 99;
    menus[k].dicthtml = jadeRender(kv,'_dict','字典'); 
    k++;
    for( item in items ) {
      if( items[item].indexOf('_')==-1 ) {
        menus[k]={};
        menus[k].html=jadeRenderWithAuth(kv,items[item],items[item]); 
        menus[k].id = items[item];
        menus[k].dict = dict; 
        k++;
      }
    }
    menus=jssort(menus);
    res.write(JSON.stringify(menus));
    res.end();
  });
};

jssort = function( arrays ) {
	arrays.sort( function cmp(a,b) { return a.xindex>b.xindex; } );
	return arrays;
};

jadeRenderWithAuth = function(kv,K,l) {
  var main = ".row\n";
  main += "  .span6\n";
  main += jadeStr( kv,K,l,'    ');
  var o = JSON.parse(kv.get(K).toString());
  o.auth = o.auth || {'admin':'','operator':'','watch':'','guest':''};
  if( o['auth'] ) {
    main +="  .span3\n";
    main += jadeStrAuth(kv,K,o['auth'],'    ');
  }
  var fn = jade.compile(main);
  return fn();
};
  
jadeRender = function( kv,K,l ) {
  var str = jadeStr(kv,K,l,'' );
  var fn = jade.compile(str);
  return fn();
};

jadeStr = function ( kv,K,l,s ) {
  var V = kv.get(K);
  console.log(V);
  var o = JSON.parse(kv.get(K).toString());
  var str = s+'form.well.form-horizontal\n';
  str += s+'  fieldset\n';
  str += s+'    legend '+l+'\n'; 
  for( var i in o ) {
    if( i!=='auth' ) {
      str += s+'    .control-group\n';
      str += s+'      lable.control-label(for="'+i+'") '+i+'\n';
      str += s+'      .controls\n';
      str += s+'        .input-append\n';
      str += s+'          input.span2(type="text",id="'+i+'",value="'+o[i]+'")\n';
      str += s+'          a.btn(type="button",id="del_'+i+'", href=\'/constructdel?DB='+kv.DB()+'&T='+kv.Table()+'&K='+K+'&P='+i+'\') 删除\n';
    } 
  }
  i = 'newItem';
  str += s+'form.well.form-inline( method="get", action=\'/constructadd?DB='+kv.DB()+'&T='+kv.Table()+'&K='+K+'&P='+i+'\')\n';
  str += s+'  input(type="hidden",name="DB",value="'+kv.DB()+'")\n';
  str += s+'  input(type="hidden",name="T",value="'+kv.Table()+'")\n';
  str += s+'  input(type="hidden",name="K",value="'+K+'")\n';
  str += s+'  input.span2(type="text",name="P",id="'+i+'",placeholder="'+'键'+'")\n';
  str += s+'  input.span2(type="text",name="V",id="'+i+'",placeholder="'+'值'+'")\n';
  str += s+'  button(type="submit",id="add_'+i+'") 添加\n';
  return str;
};

exports.delP = function( aKey ) {
  kv.root('.'+config.kvdb);
  kv.DB(aKey.DB);
  kv.Table(aKey.T);
  var V = JSON.parse(kv.get(aKey.K).toString());
  delete V[aKey.P];
  kv.set(aKey.K,JSON.stringify(V));
};
exports.addP = function( aKey ) {
  kv.root('.'+config.kvdb);
  kv.DB(aKey.DB);
  kv.Table(aKey.T);
  var V = JSON.parse(kv.get(aKey.K).toString());
  V[aKey.P]=aKey.V;
  kv.set(aKey.K,JSON.stringify(V));
};

jadeStrAuth = function( kv, K, o, s ) {
  var str = s+'.well(id="auth",data-toggle="form")\n';
  str += s+'  input(type="hidden",name="DB",value="'+kv.DB()+'")\n';
  str += s+'  input(type="hidden",name="T",value="'+kv.Table()+'")\n';
  str += s+'  input(type="hidden",name="K",value="'+K+'")\n';
  str += s+'  input(type="hidden",name="P",value="'+'auth'+'")\n';
  for( var i in o ) {
    str += s + '  lable '+i+'\n';
    str += s + '  .btn-group( data-toggle="buttons-checkbox",name="'+i+'" )\n';
    var right = o[i]; 
    var rs = { 'a':'A', 'd':'D', 'r':'R', 'w':'W', 'x':'X' };
    for( var r in rs ) {
      
      if( right.indexOf(r) == -1 ) {
        str += s + '    a.btn.btn-small.btn-info( name="'+r+'" ) '+rs[r]+'\n';
      } else {
        str += s + '    a.btn.btn-small.btn-info.active( name="'+r+'" ) '+rs[r]+'\n';
      } 
    }
  }
  str += s+'  hr\n';
  str += s+'  button.btn-primary\n';
  str += s+'    i.icon-refresh.icon-white\n';
  str += s+'    |修改\n';
  return str;
};

exports.backup = function( DB ) {
  kv.root('.'+config.kvdb);
  var V ={};
  V.DB=DB;
  kv.backup(V);
};

exports.restore = function( DB ) {
  kv.root('.'+config.kvdb);
  var V ={};
  V.DB=DB;
  kv.restore(V);
};
  
