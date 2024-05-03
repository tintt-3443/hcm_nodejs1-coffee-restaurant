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

const changeTypeDrink = $('#drink');
const changeTypeFood = $('#cake');

if (changeTypeDrink) {
  changeTypeDrink.on('click', function () {
    const url = buildURLWithQuery(window.location.href, { typeId: 1 });
    window.location.href = url;
  });
}

if (changeTypeFood) {
  changeTypeFood.on('click', function () {
    const url = buildURLWithQuery(window.location.href, { typeId: 2 });
    window.location.href = url;
  });
}

const clearFilter = $('#clearFilter');
if (clearFilter) {
  clearFilter.on('click', function () {
    window.location.href = window.location.origin + window.location.pathname;
  });
}
