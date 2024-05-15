let editor;

ClassicEditor.create(document.querySelector('#editor'))
  .then((createdEditor) => {
    editor = createdEditor;
  })
  .catch((error) => {
    console.error(error);
  });

const btnSubmit = $('#btn-submit-blog');
const locale = getCookie('locale');
if (btnSubmit) {
  btnSubmit.on('click', function () {
    const fileInput = document.getElementById('fileInputBlog');
    const file = fileInput.files[0];
    const formData = new FormData();
    const title = $('#title').val();
    const content = editor.getData();
    const description = $('#description').val();
    formData.append('file', file);
    formData.append('title', title);
    formData.append('content', content);
    formData.append('description', description);
    fetch('/admin/blog/create', {
      method: 'POST',
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        Swal.fire({
          title: locale == 'vi' ? 'Thông báo' : 'Notify',
          text: locale == 'vi' ? 'Tạo blog thành công' : 'Successfully',
          icon: 'success',
        });

        setTimeout(() => {
          window.location.href = '/admin/blog';
        }, 2000);
      })
      .catch((err) => {
        console.log('err', err);
      });
  });
}
