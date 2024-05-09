// check srcoll 2/3 page height
let isSentApi = false;
const reachPoint = document.body.scrollHeight * (2 / 3);

document.addEventListener('scroll', function () {
  const scrolledTo = window.scrollY + window.innerHeight;

  if (scrolledTo > reachPoint && !isSentApi) {
    //send API
    isSentApi = true;
    const id = $('.id-blog').attr('id');
    if (id) {
      fetch(`/blog/view/${id}`, {
        method: 'POST',
      })
        .then((response) => response.json())
        .then(() => {
          if (!isSentApi) {
            isSentApi = true;
          } else {
            return;
          }
        });
    }
  }
});
