//get cookie token

var token = getCookie('token');
if (!token) {
  $('.btn-login').show();
  $('.btn-group').hide();
} else {
  $('.btn-login').hide();
  $('.btn-group').show();
}

const currentUrl = window.location.pathname;
if (currentUrl && currentUrl.includes('admin')) {
  const header = $('#header');
  const footer = $('#footer');
  if (header && footer) {
    footer.addClass('d-none');
    header.addClass('d-none');
  }
}
