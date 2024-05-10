// fetch data from the server /revenue

const fetchData = async () => {
  await fetch('/admin/revenue', {
    method: 'GET',
  })
    .then((res) => res.json())
    .then((data) => {
      const { revenue, status } = data;
      if (status === 'success' && revenue) {
        const dataLabel = revenue.map((item) => 'Month ' + item.Month);
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
fetchData();
