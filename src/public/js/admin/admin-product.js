const btnUpload = $('#btn-uploadImg-product');
const inputImage = $('#fileInput-product');
if (btnUpload && inputImage) {
  btnUpload.on('click', function () {
    inputImage.click();
  });
}

inputImage.on('change', function () {
  //just only fileinput
  const file = inputImage[0].files[0];
  // jusr accept image
  if (!file.type.match('image.*')) {
    Swal.fire({
      title: 'Thông báo',
      text: 'Vui lòng chọn file ảnh',
      icon: 'warning',
    });
    return;
  }
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = function () {
    const img = $('#profilePicture');
    img.attr('src', reader.result);
  };
});

const btnUpdateAdmin = $('#btn-update-product-admin');
const locale = getCookie('locale');
if (btnUpdateAdmin) {
  btnUpdateAdmin.on('click', function () {
    const id = btnUpdateAdmin.val();
    const name = $('#product-name').val();
    const description = $('#product-desc').val();
    const price = $('#product-price').val();
    const fileInput = document.getElementById('fileInput-product');
    const file = fileInput.files[0];
    const formData = new FormData();
    formData.append('file', file);
    if (id) {
      formData.append('productId', id);
    }
    formData.append('name', name);
    formData.append('description', description);
    formData.append('price', Number(price));
    fetch('/admin/product/update', {
      method: 'POST',

      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        const { status } = data;
        if (!status) {
        } else {
          Swal.fire({
            title: locale == 'vi' ? 'Thông báo' : 'Notify',
            text:
              locale == 'vi'
                ? 'Thay đổi thông tin sản phẩm thành công'
                : 'Successfully',
            icon: 'success',
          });
        }
      })
      .catch((err) => {});
  });
}

const btnDeleteProduct = $('.btn-delete-product');
if (btnDeleteProduct) {
  btnDeleteProduct.on('click', function () {
    const id = $(this).val();
    Swal.fire({
      title: locale == 'vi' ? 'Xác nhận xóa' : 'Confirm delete',
      text:
        locale == 'vi'
          ? 'Bạn có chắc chắn muốn xóa sản phẩm này không?'
          : 'Are you sure you want to delete this product?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: locale == 'vi' ? 'Đồng ý' : 'Yes',
      cancelButtonText: locale == 'vi' ? 'Hủy' : 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(`/admin/product/delete/${id}`, {
          method: 'DELETE',
        })
          .then((res) => res.json())
          .then((data) => {
            const { status } = data;
            if (status) {
              Swal.fire({
                title: locale == 'vi' ? 'Thông báo' : 'Notify',
                text:
                  locale == 'vi'
                    ? 'Xóa sản phẩm thành công'
                    : 'Delete successfully',
                icon: 'success',
              }).then(() => {
                location.reload();
              });
            }
          })
          .catch((err) => {
            console.log('err', err);
          });
      }
    });
  });
}

const btnSearch = $('#btn-search');
if (btnSearch) {
  btnSearch.on('click', function () {
    const ipSearch = $('#search');
    const search = ipSearch.val();
    const url = buildURLWithQuery(window.location.href, { keyword: search });
    window.location.href = url;
  });
  const keyword = getValueFromQueryString('keyword');
  $('#search').val(keyword);
}
const minPrice = $('#minRange');
const maxPrice = $('#maxRange');
if (minPrice) {
  minPrice.on('keypress', function (e) {
    if (e.which === 13) {
      // Get minPrice value from input
      const minPriceValue = minPrice.val();

      // Build URL with minPrice query parameter
      const url = buildURLWithQuery(window.location.href, {
        minRange: minPriceValue,
      });

      // Redirect to the new URL
      window.location.href = url;

      // Update the value of minPrice input from query parameter
    }
  });
  const minPriceFromQueryString = getValueFromQueryString('minRange');
  if (minPriceFromQueryString > 0) {
    $('#minRange').val(minPriceFromQueryString);
  }
}

if (maxPrice) {
  maxPrice.on('keypress', function (e) {
    if (e.which === 13) {
      // Get maxPrice value from input
      const maxPriceValue = maxPrice.val();

      // Build URL with maxPrice query parameter
      const url = buildURLWithQuery(window.location.href, {
        maxRange: maxPriceValue,
      });

      // Redirect to the new URL
      window.location.href = url;

      // Update the value of maxPrice input from query parameter
    }
  });

  const maxPriceFromQueryString = getValueFromQueryString('maxRange');
  if (maxPriceFromQueryString > 0) {
    $('#maxRange').val(maxPriceFromQueryString);
  }
}
