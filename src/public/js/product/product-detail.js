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
        } else btn.classList.remove('selected');
      });
    });
  });
}
