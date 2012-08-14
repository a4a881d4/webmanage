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
//  str += '  $("button#logout").click( function() { $.get("/logout") });\n';
  return str;
};

jsmain = function( menus ) {
  str = '  $("ul.nav").append(main_menu());\n';
  str += '  function main_menu() {\n';
  str += '    var html = "";\n';
  for( menu in menus ) {
    str += '    html += \'<li class="dropdown" id="'+menus[menu].id+'">\';\n';
    str += '    html += \'<a class="dropdown-toggle" href="?m='+menus[menu].id+'">\';\n';
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
    str += '    html += \'<a id="'+subs[sub].id+'" href="/'+subs[sub].cmd+'">\';\n';
    str += '    html += \''+subs[sub].name+'\'+\'</a></li>\';\n';
  }    
  str += '    html += \'</ul>\';\n';
  str += '    return html;\n  }\n';
  return str;
}; 
   
jsfoot = function() {
  str = '});';
  return str;
};

exports.navbar = function(req, res) {
  res.writeHead(200,{'Content-Type': 'text/script; charset=utf-8'});
  res.write(jshead());
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
      
      var V = JSON.parse(kv.get('_name'));
      menus[k].name = V.name;
      menus[k].xindex = V.xindex;
      k++;
    }
  }
  res.write(jsmain(jssort(menus)));  
  for( item in menus ) {
    kv.Table(menus[item].id);
    var submenus = [];
    var tabs = kv.list();
    k = 0;
    for( tab in tabs ) {
      if( tabs[tab].indexOf('_')==-1 ) {
        var V = JSON.parse(kv.get(tabs[tab]));
        if( V.cmd != undefined && V.name != undefined ) {
          submenus[k]={};
          submenus[k].id = tabs[tab];
          submenus[k].cmd = V.cmd;
          submenus[k].name = V.name;
          k++;
        }
      }
    }
    if( k>0 ) {
      res.write( jssub(menus[item].id,jssort(submenus) ));
    }
  }    
  res.write(jsfoot());
  res.end();
};

