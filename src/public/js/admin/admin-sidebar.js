$(document).ready(function () {
  var currentUrl = window.location.pathname;

  $('.item-sidebar').each(function () {
    var itemUrl = $(this).attr('href');
    if (currentUrl === itemUrl) {
      $(this).addClass('active');
    } else {
      $(this).removeClass('active');
    }
  });
});

const btnLogoutSb = $('.btn-logout-sidebar');
if (btnLogoutSb) {
  btnLogoutSb.on('click', function () {
    fetch('/auth/logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => res.text())
      .then(() => {
        // redirect auth/login
        window.location.href = '/auth/login';
      });
  });
}
