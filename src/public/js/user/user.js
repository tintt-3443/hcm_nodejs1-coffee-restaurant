const btnUpload = $('#btn-uploadImg');
const inputImage = $('#fileInput');

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

const ClearErrorMsg = (keys) => {
  keys.forEach((key) => {
    const notiElement = document.getElementById(`error-msg-${key}`);
    notiElement.classList.add('d-none');
  });
};

const btnUpdateProfile = $('#btn-update-profile');
const locale = getCookie('locale');
if (btnUpdateProfile) {
  btnUpdateProfile.on('click', function () {
    const id = btnUpdateProfile.val();
    const name = $('#name').val();
    const email = $('#email').val();
    const phone = $('#phone').val();
    const address = $('#address').val();
    const date_of_birth = $('#date_of_birth').val();
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];
    const formData = new FormData();
    formData.append('file', file);
    // Thêm các trường thông tin khác
    formData.append('name', name);
    formData.append('email', email);
    formData.append('phone', phone);
    formData.append('address', address);
    formData.append('date_of_birth', date_of_birth);
    fetch(`/user/update/${id}`, {
      method: 'POST',
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        const { status, errors } = data;
        if (!status) {
          ClearErrorMsg(['name', 'email', 'phone', 'address', 'date_of_birth']);
          errors.forEach((key) => {
            // document.getElementById(key).classList.add('text-danger');
            const notiElement = document.getElementById(
              `error-msg-${key.name}`,
            );
            notiElement.classList.remove('d-none');
            notiElement.innerText = key.msg;
          });
        } else {
          Swal.fire({
            title: locale == 'vi' ? 'Thông báo' : 'Notify',
            text:
              locale == 'vi'
                ? 'Thay đổi thông tin cá nhân thành công'
                : 'Successfully',
            icon: 'success',
          }).then((confirmed) => {
            if (confirmed.isConfirmed) {
              ClearErrorMsg([
                'name',
                'email',
                'phone',
                'address',
                'date_of_birth',
              ]);
            }
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  });
}

const btnChangePassword = $('#btn-change-pw');
if (btnChangePassword) {
  btnChangePassword.on('click', function () {
    const id = btnChangePassword.val();
    const oldPassword = $('#oldPassword').val();
    const newPassword = $('#newPassword').val();
    const confirmPassword = $('#confirmPassword').val();
    fetch(`/user/change-password/${id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ oldPassword, newPassword, confirmPassword }),
    })
      .then((res) => res.json())
      .then((data) => {
        const { status, errors } = data;
        if (!status) {
          ClearErrorMsg(['oldPassword', 'newPassword', 'confirmPassword']);
          errors.forEach((key) => {
            const notiElement = document.getElementById(
              `error-msg-${key.name}`,
            );
            notiElement.classList.remove('d-none');
            notiElement.innerText = key.msg;
          });
        } else {
          Swal.fire({
            title: locale == 'vi' ? 'Thông báo' : 'Notify',
            text:
              locale == 'vi'
                ? 'Thay đổi mật khẩu thành công'
                : 'Successfully !!',
            icon: 'success',
          }).then((confirmed) => {
            if (confirmed.isConfirmed) {
              ClearErrorMsg(['oldPassword', 'newPassword', 'confirmPassword']);
              //clear input value
              $('#oldPassword').val('');
              $('#newPassword').val('');
              $('#confirmPassword').val('');
            }
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  });
}
