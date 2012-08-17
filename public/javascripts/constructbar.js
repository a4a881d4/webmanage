$(function() {
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
        str = '<form method="post" action="/menu" id="form_'+menus[menu].id+'"/>';
        $("#side .tab-content .tab-pane#"+menus[menu].id).append(str);
        if( menus[menu].id == 'new' ) {
          str = '<lable>id:</lable><input id="id_'+menus[menu].id+'" name="id" class="span2"/>';
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
        str = '<hr/><button id="submit_'+menus[menu].id+'" class="btn btn-primary"><i class="icon-refresh icon-white"/>修改</button>';
        $('#side .tab-content .tab-pane #form_'+menus[menu].id).append(str);
        str = '<button id="delete_'+menus[menu].id+'" class="btn btn-danger"><i class="icon-remove icon-white"/>删除</button>';
        $('#side .tab-content .tab-pane #form_'+menus[menu].id).append(str);
      }
      $('#side .nav.nav-tabs a:first').tab('show');
      $('a[data-toggle="tab"]').on('shown',function(e) {
        var V={};
        V.id=e.target.getAttribute('mid');
        $.get('/submenu',V,function(data,textStatus) {
          if( textStatus == 'success' ) {
            var menus=JSON.parse(data);
            $("#main").html("");
            var str = '<ul class="nav nav-tabs"/>';
            $("#main").append(str);
            for( var menu in menus ) {  
              str = '<li><a href="#'+menus[menu].id+'" data-toggle="tab" mid="'+menus[menu].id+'">'+menus[menu].name+'</a></li>';
              $("#main .nav.nav-tabs").append(str);
            }
            str = '<div class="tab-content"/>';
            $("#main").append(str);
            for( var menu in menus ) { 
              str = '<div id="'+menus[menu].id+'" class="tab-pane"/>';
              $("#main .tab-content").append(str);
              if( menus[menu].id != '_main' ) {
                str = '<input id="'+menus[menu].id+'" name="name" class="span2"/>';
                $('#main .tab-content .tab-pane#'+menus[menu].id).append(str);
                $('#main .tab-content input#'+menus[menu].id).attr('value',menus[menu].name);
                var auth = menus[menu].auth;
                for( var ath in auth ) {
                  str = authButton(ath,auth[ath],menus[menu].id);
                  $('#main .tab-content .tab-pane#'+menus[menu].id).append(str);
                }
                str = '<hr/><button id="submit_'+menus[menu].id+'" class="btn btn-primary"><i class="icon-refresh icon-white"/>修改</button>';
                $('#main .tab-content .tab-pane#'+menus[menu].id).append(str);
                str = '<button id="delete_'+menus[menu].id+'" class="btn btn-danger"><i class="icon-remove icon-white"/>删除</button>';
                $('#main .tab-content .tab-pane#'+menus[menu].id).append(str);
              } else {
              	str = '<lable>Tilte:</lable><input class="span4" value="'+menus[menu].title+'"/>';
              	$('#main .tab-content .tab-pane#'+menus[menu].id).append(str);
                str = '<textarea border="1" class="field span8" rows="6"/>';
                $('#main .tab-content .tab-pane#'+menus[menu].id).append(str);
                $('#main .tab-content .tab-pane#'+menus[menu].id+' textarea').attr('value',menus[menu].content);
                str = '<hr/><button id="submit_'+menus[menu].id+'" class="btn btn-primary"><i class="icon-refresh icon-white"/>修改</button>';
                $('#main .tab-content .tab-pane#'+menus[menu].id).append(str);
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