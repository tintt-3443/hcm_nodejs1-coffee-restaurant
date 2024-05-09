const btnLogout = $('.btn-logout');
if (btnLogout) {
  btnLogout.on('click', function () {
    fetch('/auth/logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => res.text())
      .then(() => {
        window.location.href = '/auth/login';
      });
  });
}
const btnI18 = $('#languageSelect');
if (btnI18) {
  $('#languageSelect').on('change', function () {
    var selectedValue = btnI18.val();
    // Get the selected value
    // Redirect to the selected page
    window.location.href = `?locale=${selectedValue}`;
  });
}
