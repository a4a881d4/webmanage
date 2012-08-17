$(function() {
  $.get("/menu","",function(data,textStatus) {
    if( textStatus == 'success' ) {
      var menus=JSON.parse(data);
      for( var menu in menus ) {  
        var str = '<div id="'+menus[menu].id+'" class="well"/>';
        $("#side").append(str);
        str = '<button id="'+menus[menu].id+'" class="btn btn-primary btn-large"/>';
        $('#'+menus[menu].id).append(str);
        $('button#'+menus[menu].id).html(menus[menu].name);
        var auth = menus[menu].auth;
        for( var ath in auth ) {
          str = authButton(ath,auth[ath]);
          $('#'+menus[menu].id).append(str);
        }
      }
    }
  });
});

function authButton( ath, right ) {
  var str = '<label> '+ath+'</label>';
  str += '<div class="btn-group" data-toggle="buttons-checkbox">';
  var rs = { 'a':'A', 'd':'D', 'r':'R', 'w':'W', 'x':'X' };
  for( var r in rs ) {
    if( right.indexOf(r) == -1 ) {
      str += '<button class="btn btn-mini btn-info" id="'+r+'">'+rs[r]+'</button>';
    } else {
      str += '<button class="btn btn-mini btn-info active" id="'+r+'">'+rs[r]+'</button>';
    } 
  }
  return str;
}