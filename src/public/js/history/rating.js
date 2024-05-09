const btnOpenRating = $('.btn-rating-product').toArray();
if (btnOpenRating) {
  btnOpenRating.forEach((btn) => {
    btn.addEventListener('click', () => {
      const values = btn.getAttribute('data-rating');
      const ratingData = JSON.parse(values); // Chuyển đổi chuỗi JSON thành một đối tượng JavaScript
      const $ratingContainer = $('.rating'); // Chọn container chứa sao
      $ratingContainer.empty(); // Xóa bỏ các sao cũ trước khi thêm mới

      // Tạo sao dựa trên rating_point
      if (ratingData?.rating_point) {
        for (let i = 0; i < ratingData.rating_point; i++) {
          $ratingContainer.append(
            '<div><i class="fas fa-star rating-item fa-sm text-warning fs-4 ml-start"></i></div>',
          );
        }

        // Tạo sao trống cho phần còn lại
        for (let i = ratingData.rating_point; i < 5; i++) {
          $ratingContainer.append(
            '<div><i class="far fa-star rating-item fa-sm text-warning fs-4 ml-start"></i></div>',
          );
        }
      } else {
        for (let i = 0; i < 5; i++) {
          $ratingContainer.append(
            '<div><i class="far fa-star rating-item fa-sm text-warning fs-4 ml-start"></i></div>',
          );
        }
      }
      const stars = document.querySelectorAll('.rating-item');
      stars.forEach((star, index) => {
        star.addEventListener('click', () => {
          for (let i = 0; i <= index; i++) {
            stars[i].classList.remove('far');
            stars[i].classList.add('fas');
          }

          for (let i = index + 1; i < stars.length; i++) {
            stars[i].classList.remove('fas');
            stars[i].classList.add('far');
          }
        });
      });
   
      $('#comment-form').val(ratingData?.comment);

      const btnRating = $('#save-rating');
      if (btnRating) {
        btnRating.on('click', function () {
          const rating = $('.rating i.fas').length;
          const comment = $('#comment-form').val();
          const productId = btn.getAttribute('id');
          const data = {
            rating_point: rating,
            comment,
            productId,
          };
          fetch('/product/rating', {
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
              $('#close-modal').click();
              window.location.reload();
            });
        });
      }
    });
  });
}
