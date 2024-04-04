//get cookie token

function getCookie(cname) {
  var name = cname + '=';
  var ca = document.cookie.split(';');
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') c = c.substring(1);
    if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
  }
  return '';
}
var token = getCookie('token');
if (!token) {
  $('.btn-login').show();
  $('.btn-group').hide();
} else {
  $('.btn-login').hide();
  $('.btn-group').show();
}
