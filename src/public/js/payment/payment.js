const btnpayment = $('#btn-submit-payment');
if (btnpayment) {
  btnpayment.on('click', function () {
    const payment = {
      name: $('#name').val(),
      email: $('#email').val(),
      phone: $('#phone').val(),
      address: $('#address').val(),
      note: $('#note').val(),
    };
    fetch('/order/payment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payment),
    })
      .then((res) => res.text())
      .then(() => {
        swal.fire({
          title: 'Success!',
          text: 'successfully !!',
          icon: 'success',
          confirmButtonText: 'OK',
        });
      });
  });
}
