const minPrice = $('#minRange');
const maxPrice = $('#maxRange');
if (minPrice) {
  minPrice.on('keypress', function (e) {
    if (e.which === 13) {
      const minPriceValue = minPrice.val();

      const url = buildURLWithQuery(window.location.href, {
        minRange: minPriceValue,
      });

      window.location.href = url;
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

const btnStatus = $('.btn-filter-status').toArray();
if (btnStatus) {
  btnStatus.forEach((btn) => {
    btn.addEventListener('click', () => {
      const status = btn.getAttribute('value');
      const url = buildURLWithQuery(window.location.href, {
        status: status,
      });
      window.location.href = url;
    });
  });
  const sortASC = getValueFromQueryString('sortASC');
  if (sortASC === 'true') {
    $('#ASC').prop('checked', true);
  } else {
    $('#DESC').prop('checked', true);
  }
}

function clearStatusQueryParam(url) {
  const parsedURL = new URL(url);
  const searchParams = parsedURL.searchParams;

  // Xóa tất cả các query param có tên là "status[]"
  searchParams.delete('status[]');

  // Trả về URL mới
  return `${parsedURL.protocol}//${parsedURL.host}${
    parsedURL.pathname
  }?${searchParams.toString()}`;
}

const btnClear = $('.btn-filter-clear');

if (btnClear) {
  btnClear.on('click', function () {
    const currentURL = window.location.href;

    // Tạo một URL mới không chứa query param "status[]"
    const newURL = clearStatusQueryParam(currentURL);

    // Chuyển hướng đến URL mới
    window.location.href = newURL;
  });
}

const arrangDate = $('input[type="radio"][name="arrange"]').toArray();
if (arrangDate) {
  arrangDate.forEach((btn) => {
    btn.addEventListener('click', () => {
      const arrange = btn.getAttribute('value');
      const url = buildURLWithQuery(window.location.href, {
        sortASC: arrange,
      });
      window.location.href = url;
      btn.prop('checked', true);
    });
  });
}

const dateFilter = $('#date-filter');
if (dateFilter) {
  dateFilter.on('change', function () {
    const date = dateFilter.val();
    const url = buildURLWithQuery(window.location.href, {
      date: date,
    });
    window.location.href = url;
  });
  const dateFromQueryString = getValueFromQueryString('date');
  if (dateFromQueryString) {
    $('#date-filter').val(dateFromQueryString);
  }
}
