$(function() {
  $("ul.nav").append('<li><a href="/constructbackup?m=web">备份</a></li>');
  $("ul.nav").append('<li><a href="/constructrestore?m=web">恢复</a></li>');
  $.get("/menu","",function(data,textStatus) {
    if( textStatus == 'success' ) {
      var menus=JSON.parse(data);
      var V = {};
      V.id = 'new';
      V.name = '新建';
      var astr = {'admin':'','operator':'','watch':'','guest':''};
      V.auth = astr;
      menus.push(V);
      var str = '<ul class="nav nav-tabs"/>';
      $("#side").append(str);
      for( var menu in menus ) {  
        str = '<li><a href="#'+menus[menu].id+'" data-toggle="tab" mid="'+menus[menu].id+'">'+menus[menu].name+'</a></li>';
        $("#side .nav.nav-tabs").append(str);
      }
      str = '<div class="tab-content"/>';
      $("#side").append(str);
      for( var menu in menus ) {  
        str = '<div id="'+menus[menu].id+'" class="tab-pane"/>';
        $("#side .tab-content").append(str);
        str = '<form class="well" id="form_'+menus[menu].id+'"/>';
        $("#side .tab-content .tab-pane#"+menus[menu].id).append(str);
        if( menus[menu].id == 'new' ) {
          str = '<p>id:(必须是全局唯一的)</p><input id="id_'+menus[menu].id+'" name="id" class="span2"/>';
          $('#side .tab-content .tab-pane #form_'+menus[menu].id).append(str);
        }
        str = '<input id="name_'+menus[menu].id+'" name="name" class="span2"/>';
        $('#side .tab-content .tab-pane #form_'+menus[menu].id).append(str);
        $('#side .tab-content .tab-pane input#name_'+menus[menu].id).attr('value',menus[menu].name);
        var auth = menus[menu].auth;
        for( var ath in auth ) {
          str = authButton(ath,auth[ath],menus[menu].id);
          $('#side .tab-content .tab-pane #form_'+menus[menu].id).append(str);
        }
        if( menus[menu].id != 'new' ) {
          str = '<hr/><button id="submit_'+menus[menu].id+'" class="btn btn-primary"><i class="icon-refresh icon-white"/>修改</button>';
          $('#side .tab-content .tab-pane #form_'+menus[menu].id).append(str);
          str = '<button id="delete_'+menus[menu].id+'" class="btn btn-danger"><i class="icon-remove icon-white"/>删除</button>';
          $('#side .tab-content .tab-pane #form_'+menus[menu].id).append(str);
        } else {
          str = '<hr/><button id="add_'+menus[menu].id+'" class="btn btn-primary"><i class="icon-refresh icon-white"/>添加</button>';
          $('#side .tab-content .tab-pane #form_'+menus[menu].id).append(str);
        }  
        $('#side button#submit_'+menus[menu].id).click( function() {
          var V = {};
          V.method = 'modify';
          V.id=this.id.substr(7);
          V.name = $('#side .tab-content .tab-pane input#name_'+V.id).attr('value');
          V.auth = buildAuth('#side .tab-content .tab-pane#'+V.id+' form');
          $.post('/menu',V);
        });
        $('#side button#delete_'+menus[menu].id).click( function() {
          var V = {};
          V.method = 'delete';
          V.id=this.id.substr(7);
          V.name = $('#side .tab-content .tab-pane input#name_'+V.id).attr('value');
          V.auth = buildAuth('#side .tab-content .tab-pane#'+V.id+' form');
          $.post('/menu',V);
        });
        $('#side button#add_'+menus[menu].id).click( function() {
          var V = {};
          V.method = 'new';
          var id=this.id.substr(4);
          V.id= $('#side .tab-content .tab-pane input#id_'+id).attr('value');
          V.name = $('#side .tab-content .tab-pane input#name_'+id).attr('value');
          V.auth = buildAuth('#side .tab-content .tab-pane#'+id+' form');
          $.post('/menu',V);
        });  
      }
      $('#side .nav.nav-tabs a:last').tab('show');
      $('a[data-toggle="tab"][mid!="new"]').on('shown',function(e) {
        var V={};
        V.id=e.target.getAttribute('mid');
        $.get('/submenu',V,function(data,textStatus) {
          if( textStatus == 'success' ) {
            var menus=JSON.parse(data);
            $("#main").html("");
            var str = '<ul class="nav nav-tabs"/>';
            $("#main").append(str);
            for( var menu in menus ) { 
              menus[menu].name = menus[menu].dict[menus[menu].id] || menus[menu].id; 
              str = '<li><a href="#'+menus[menu].id+'" data-toggle="tab" mid="'+menus[menu].id+'">'+menus[menu].name+'</a></li>';
              $("#main .nav.nav-tabs").append(str);
            }
            str = '<div class="tab-content"/>';
            $("#main").append(str);
            for( var menu in menus ) { 
              str = '<div id="'+menus[menu].id+'" class="tab-pane"/>';
              $("#main .tab-content").append(str);
              if( menus[menu].id != '_main' ) {
                $('#main .tab-content .tab-pane#'+menus[menu].id).html(menus[menu].html);
                $("#auth[data-toggle='form'] button").click( modifyAuth );
              } else {
                str = '<lable>Tilte:</lable><input class="span4" value="'+menus[menu].title+'"/>';
              	$('#main .tab-content .tab-pane#'+menus[menu].id).append(str);
                str = '<textarea border="1" class="field span8" rows="6"/>';
                $('#main .tab-content .tab-pane#'+menus[menu].id).append(str);
                $('#main .tab-content .tab-pane#'+menus[menu].id+' textarea').attr('value',menus[menu].content);
                str = '<hr/><button id="submit_'+menus[menu].id+'" class="btn btn-primary"><i class="icon-refresh icon-white"/>修改</button>';
                $('#main .tab-content .tab-pane#'+menus[menu].id).append(str);
                $('#tables').html(menus[menu].dicthtml);
              }
            }
            $('#main .nav.nav-tabs a:first').tab('show');
          }
        });
      });
    }
  });
});

function authButton( ath, right, id ) {
  var str = '<label> '+ath+'</label>';
  str += '<div class="btn-group" data-toggle="buttons-checkbox" id="_'+id+'" name="'+ath+'">';
  var rs = { 'a':'A', 'd':'D', 'r':'R', 'w':'W', 'x':'X' };
  for( var r in rs ) {
    if( right.indexOf(r) == -1 ) {
      str += '<a class="btn btn-mini btn-info" name="'+r+'">'+rs[r]+'</a>';
    } else {
      str += '<a class="btn btn-mini btn-info active" name="'+r+'">'+rs[r]+'</a>';
    } 
  }
  str += '</div>';
  return str;
}

function buildAuth( str ) {
  var ret = {'admin':'','operator':'','watch':'','guest':''};
  for( var r in ret ) {
    $(str+' .btn-group[name="'+r+'"] .btn.active').each( function() {
      ret[r] += this.getAttribute('name');
    });
  }
  return ret;
};

function modifyAuth() {
  var V={};
  $(this).siblings("input").each( function() {
    V[this.name]=this.value;
  });
  V.V = {'admin':'','operator':'','watch':'','guest':''};
  for( var r in V.V ) {
    $(this).siblings('.btn-group[name="'+r+'"]').children('.btn.active').each( function() {
      V.V[r] += this.name;
    });
  }
  $.get("/constructadd",V);
};
  
  
      