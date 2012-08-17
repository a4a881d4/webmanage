$(function() {
  $.get("/menu","",function(data,textStatus) {
    if( textStatus == 'success' ) {
      var menus=JSON.parse(data);
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
        str = '<input id="'+menus[menu].id+'" name="name" class="span2"/>';
        $('#side .tab-content #'+menus[menu].id).append(str);
        $('#side .tab-content input#'+menus[menu].id).attr('value',menus[menu].name);
        var auth = menus[menu].auth;
        for( var ath in auth ) {
          str = authButton(ath,auth[ath],menus[menu].id);
          $('#side .tab-content .tab-pane#'+menus[menu].id).append(str);
        }
        str = '<hr/><button id="submit_'+menus[menu].id+'" class="btn btn-primary">修改</button>';
        $('#side .tab-content .tab-pane#'+menus[menu].id).append(str);
        str = '<button id="delete_'+menus[menu].id+'" class="btn btn-danger">删除</button>';
        $('#side .tab-content .tab-pane#'+menus[menu].id).append(str);
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
                str = '<hr/><button id="submit_'+menus[menu].id+'" class="btn btn-primary">修改</button>';
                $('#main .tab-content .tab-pane#'+menus[menu].id).append(str);
                str = '<button id="delete_'+menus[menu].id+'" class="btn btn-danger">删除</button>';
                $('#main .tab-content .tab-pane#'+menus[menu].id).append(str);
              } else {
                str = '<input type="text"/>';
                $('#main .tab-content .tab-pane#'+menus[menu].id).append(str);
                $('#main .tab-content .tab-pane#'+menus[menu].id+' input').attr('value',menus[menu].content);
                str = '<hr/><button id="submit_'+menus[menu].id+'" class="btn btn-primary">修改</button>';
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
  str += '<div class="btn-group" data-toggle="buttons-checkbox" id="'+id+'" name="'+ath+'">';
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