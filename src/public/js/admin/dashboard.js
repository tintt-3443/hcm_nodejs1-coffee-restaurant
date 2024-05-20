// fetch data from the server /revenue

$('#yearSelect').on('change', function () {
  var selectedValue = $(this).val();
  const url = buildURLWithQuery(window.location.href, {
    year: selectedValue,
  });
  window.location.href = url;
});
const yearValue = getValueFromQueryString('year');
if (yearValue) {
  $('#yearSelect').val(yearValue);
}
$(document).ready(function () {
  $('input[name="type"]').change(function () {
    var selectedValue = $('input[name="type"]:checked').val();
    const currentUrl = new URL(window.location.href);
    // Clear all existing search parameters
    currentUrl.search = '';
    // Set the 'month' parameter
    currentUrl.searchParams.set('type', selectedValue);
    window.location.href = currentUrl.toString();
  });
});

const valueFromQueryString = getValueFromQueryString('type');
if (valueFromQueryString === 'year') {
  const slt = $('#groupbyyear');
  $('#groupbyyear').prop('checked', true);
  $('#yearSelect').prop('disabled', true);
} else {
  const slt = $('#groupbymonth');
  $('#groupbymonth').prop('checked', true);
}
const dateFilterStart = $('#date-filter-start');
if (dateFilterStart) {
  dateFilterStart.on('change', function () {
    const date = dateFilterStart.val();
    const url = buildURLWithQuery(window.location.href, {
      startDate: date,
    });
    window.location.href = url;
  });
  const dateFromQueryString = getValueFromQueryString('startDate');
  if (dateFromQueryString) {
    $('#date-filter-start').val(dateFromQueryString);
  }
}
const dateFilterEnd = $('#date-filter-end');
if (dateFilterEnd) {
  dateFilterEnd.on('change', function () {
    const date = dateFilterEnd.val();
    const url = buildURLWithQuery(window.location.href, {
      endDate: date,
    });
    window.location.href = url;
  });
  const dateFromQueryString = getValueFromQueryString('endDate');
  if (dateFromQueryString) {
    $('#date-filter-end').val(dateFromQueryString);
  }
}

const fetchData = async () => {
  const valueFromQuery = getValueFromQueryString('type');
  const year = getValueFromQueryString('year') || new Date().getFullYear();

  await fetch(
    '/admin/revenue?' +
      new URLSearchParams({
        type: valueFromQuery,
        change: new Date().getTime(),
        year: year,
      }),
    {
      method: 'GET',
    },
  )
    .then((res) => res.json())
    .then((data) => {
      const { revenue } = data;
      if (revenue) {
        const dataLabel = revenue.map((item) => item.Column);
        const dataValue = revenue.map((item) => item.TotalRevenue);
        const ctx = document.getElementById('myChart');
        new Chart(ctx, {
          type: 'bar',
          data: {
            labels: dataLabel,
            datasets: [
              {
                label: 'Revenue 2024',
                data: dataValue,
                borderWidth: 1,
                backgroundColor: [
                  'rgba(255, 99, 132, 0.2)',
                  'rgba(54, 162, 235, 0.2)',
                ],
              },
            ],
          },
          options: {
            scales: {
              y: {
                beginAtZero: true,
              },
            },
          },
        });
      }
    })
    .catch((err) => {
      console.log('err', err);
    });
};
const customRangeStart = getValueFromQueryString('startDate');
const customRangeEnd = getValueFromQueryString('endDate');
if (!(customRangeStart && customRange)) fetchData();
