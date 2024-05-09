const btnCancels = $('.cancel-btn').toArray();
const locale_history = getCookie('locale');
btnCancels.forEach((btn) => {
  btn.addEventListener('click', () => {
    const id = btn.getAttribute('id');
    const url = `/order/update/${id}`;
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status: false }),
    })
      .then((res) => res.text())
      .then(() => {
        swal.fire({
          title: locale_history === 'en' ? 'Success!' : 'Thành công!',
          text:
            locale_history === 'vi'
              ? 'Cancel successfully !!'
              : 'Hủy thành công !!',
          icon: 'success',
          confirmButtonText: 'OK',
        });
        setTimeout(() => {
          window.location.reload();
        }, 1200);
      });
  });
});

//confirm-btn
const btnConfirms = $('.confirm-btn').toArray();
btnConfirms.forEach((btn) => {
  btn.addEventListener('click', () => {
    const id = btn.getAttribute('id');
    const url = `/order/update/${id}`;
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status: true }),
    })
      .then((res) => res.text())
      .then(() => {
        swal.fire({
          title: locale_history === 'en' ? 'Success!' : 'Thành công!',
          text:
            locale_history === 'en'
              ? 'Confirm successfully !!'
              : 'Xác nhận thành công !!',
          icon: 'success',
          confirmButtonText: 'OK',
        });
        setTimeout(() => {
          window.location.reload();
        }, 1200);
      });
  });
});

//success-btn
const btnSuccess = $('.success-btn').toArray();
btnSuccess.forEach((btn) => {
  btn.addEventListener('click', () => {
    const id = btn.getAttribute('id');
    const url = `/order/update/${id}`;
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status: true }),
    })
      .then((res) => res.text())
      .then(() => {
        swal.fire({
          title: locale_history === 'en' ? 'Success!' : 'Thành công!',
          text: locale_history === 'en' ? 'Successfully !!' : 'Thành công !!',
          icon: 'success',
          confirmButtonText: 'OK',
        });
        setTimeout(() => {
          window.location.reload();
        }, 1200);
      });
  });
});
