/*
 * GET home page.
 */

var config = require('../config.js').config;
var kv = require('filekvdb');

jssort = function( arrays ) {
	arrays.sort( function cmp(a,b) { return a.xindex>b.xindex; } );
	return arrays;
};

jshead = function() {
  str = '$(function() {\n';
  return str;
};

jsmain = function( menus ) {
  str = '  $("ul.nav").append(main_menu());\n';
  str += '  function main_menu() {\n';
  str += '    var html = "";\n';
  for( menu in menus ) {
    str += '    html += \'<li class="dropdown" id="'+menus[menu].id+'">\';\n';
    str += '    html += \'<a class="dropdown-toggle" data-toggle="dropdown" href="#'+menus[menu].id+'">\';\n';
    str += '    html += \''+menus[menu].name+'\'+\'</a></li>\';\n';
  }    
  str += '    return html;\n  }\n';
  return str;
}; 

jssub = function( main, subs ) {
	
	str = '  $("li#'+main+' a").append(\'<b class="caret" />\');\n';
  str += '  $("li#'+main+'").append(sub_menu_'+main+'());\n';
  str += '  function sub_menu_'+main+'() {\n';
  str += '    var html = \'<ul class="dropdown-menu">\';\n';
  for( sub in subs ) {
    str += '    html += \'<li>\';\n';
    str += '    html += \'<a id="'+subs[sub].id+'" href="?m='+main+'&s='+subs[sub].id+'">\';\n';
    str += '    html += \''+subs[sub].name+'\'+\'</a></li>\';\n';
  }    
  str += '    html += \'</ul>\';\n';
  str += '    return html;\n  }\n';
  return str;
}; 
   
jsfoot = function() {
	str = "$().dropdown()\n";
  str += '});\n';
  return str;
};

jsmenu = function( className, res ) {
  kv.root(__dirname+'/..'+config.kvdb);
  kv.DB(config.webdb);
  var items = kv.listTable();
  var menus = [];
  var k = 0;
  for( item in items ) {
    if( items[item].indexOf('_')==-1 ) {
      kv.Table(items[item]);
      menus[k]={};
      menus[k].id = items[item];
      var str = kv.get('_name').toString();
      console.log(items[item]+":"+str);
      var V = JSON.parse(str);
      if( V.auth[className].indexOf('r')!=-1 ) {
        menus[k].name = V.name;
        menus[k].xindex = V.xindex;
        k++;
      }
    }
  }
  res.write(jsmain(jssort(menus)));  
  for( item in menus ) {
    kv.Table(menus[item].id);
    var submenus = [];
    var tabs = kv.list();
    k = 0;
    for( tab in tabs ) {
      if( tabs[tab].indexOf('_')==-1 && tabs[tab].indexOf('newSubMenu')==-1 ) {
        var V = JSON.parse(kv.get(tabs[tab]));
        if( V.auth[className].indexOf('r')!=-1) {
          submenus[k]=V;
          submenus[k].id = tabs[tab];
          k++;
        }
      }
    }
    if( k>0 ) {
      res.write( jssub(menus[item].id,jssort(submenus) ));
    }
  }    
};
  
exports.navbar = function(req, res) {
	res.writeHead(200,{'Content-Type': 'text/javascript; charset=utf-8'});
  res.write(jshead());
  var uclass = 'guest';
  if( req.session ) { 
    if( req.session.user ){
      uclass = req.session.user.uclass;
    }
  }
  jsmenu(uclass, res);
  res.write(jsfoot());
  res.end();
};

