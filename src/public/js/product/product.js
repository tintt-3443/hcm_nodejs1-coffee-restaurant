const btns = document.querySelectorAll('.btn-menu');
if (btns) {
  btns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const id = e.target.id;
      btns.forEach((btn) => {
        if (btn.id === id) {
          btn.classList.add('active-menu');
        } else {
          btn.classList.remove('active-menu');
        }
      });
    });
  });
}
