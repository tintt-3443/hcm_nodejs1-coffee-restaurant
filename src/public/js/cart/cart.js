const inputQuantities = $('.input-quantity').toArray();
const locale = getCookie('locale');
inputQuantities.forEach((inputQuantity) => {
  //add event listener onchange
  inputQuantity.addEventListener('change', function () {
    //get id from inputQuantity
    const id = inputQuantity.getAttribute('id');
    const quantity = inputQuantity.value;
    fetch(`/cart/update/${id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ quantity }),
    })
      .then((response) => response.json())
      .then(() => {
        window.location.reload();
      });
  });
});

const deleteButtons = $('.btn-remove-cart').toArray();
deleteButtons.forEach((deleteButton) => {
  deleteButton.addEventListener('click', function () {
    const id = deleteButton.getAttribute('id');
    fetch(`/cart/delete/${id}`, {
      method: 'DELETE',
    })
      .then((response) => response.json())
      .then(() => {
        swal.fire({
          title: locale === 'en' ? 'Success!' : 'Thành công!',
          text:
            locale === 'en' ? 'Deleted successfully !!' : 'Xóa thành công !!',
          icon: 'success',
          confirmButtonText: 'OK',
        });
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      });
  });
});
