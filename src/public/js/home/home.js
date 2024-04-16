//get cookie token


var token = getCookie('token');
if (!token) {
  $('.btn-login').show();
  $('.btn-group').hide();
} else {
  $('.btn-login').hide();
  $('.btn-group').show();
}
