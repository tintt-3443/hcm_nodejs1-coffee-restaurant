const locale = getCookie('locale');

const btnSize = document.querySelectorAll('.size-select');
if (btnSize) {
  btnSize.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const id = e.target.id;
      btnSize.forEach((btn) => {
        if (btn.id === id) {
          btn.classList.add('selected');
        } else btn.classList.remove('selected');
      });
    });
  });
}

const btntoppings = document.querySelectorAll('.topping-select');
if (btntoppings) {
  btntoppings.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const id = e.target.id;
      btntoppings.forEach((btn) => {
        if (btn.id === id) {
          if (btn.classList.contains('selected')) {
            btn.classList.remove('selected');
          } else btn.classList.add('selected');
        }
      });
    });
  });
}

const addToCart = (e, id) => {
  const token = getCookie('token');
  //convert size to boolean
  if (!token) {
    swal.fire({
      title: locale === 'en' ? 'Error' : 'Lỗi',
      text:
        locale === 'en'
          ? 'Please login to continue'
          : 'Vui lòng đăng nhập để tiếp tục',
      icon: 'error',
      confirmButtonText: 'OK',
    });
    return;
  }
  const size =
    document.querySelector('.size-select.selected').value === 'true'
      ? true
      : false;

  const toppings = document.querySelectorAll('.topping-select.selected');
  const list = [];
  toppings.forEach((topping) => {
    list.push(parseInt(topping.id));
  });
  const productId = id;
  const data = {
    up_size: size ? true : false,
    toppings: list,
    quantity: 1,
    productId: productId,
  };
  fetch(`/cart/add/${productId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
    .then((res) => res.text())
    .then(() => {
      swal.fire({
        title: locale === 'en' ? 'Successfully !' : 'Thành công !',
        text: locale === 'en' ? 'successfully !!' : 'Thành công !',
        icon: 'success',
        confirmButtonText: 'OK',
      });
    });
};
