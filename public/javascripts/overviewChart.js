function printChartBar(accBalance, amountTrans, net) {
  const ctx2 = document.getElementById('myChart2').getContext('2d');
  window.myHorizontalBar = new Chart(ctx2, {
    type: 'horizontalBar',
    data: {
      labels: ['Overview'],
      datasets: [
        {
          label: 'Expenses/Income',
          backgroundColor: 'rgba(255, 46, 46, 0.2)',
          borderColor: 'rgba(255, 46, 46, 1)',
          borderWidth: 1,
          data: [amountTrans],
        },
        {
          label: 'Balance',
          backgroundColor: 'rgba(30, 255, 0, 0.2)',
          borderColor: 'rgba(30, 255, 0, 1)',
          borderWidth: 1,
          data: [accBalance],
        },
        {
          label: 'Net',
          backgroundColor: 'rgba(30, 0, 255, 0.2)',
          borderColor: 'rgba(30, 0, 255, 1)',
          borderWidth: 1,
          data: [net],
        },
      ],
    },
    options: {
      // Elements options apply to all of the options unless overridden in a dataset
      // In this case, we are setting the border of each horizontal bar to be 2px wide
      elements: {
        rectangle: {
          borderWidth: 2,
        },
      },
      maintainAspectRatio: false,
      responsive: true,
      legend: {
        position: 'right',
        labels: {
          usePointStyle: true
        }
      },
      title: {
        display: true,
        text: 'Finance Overview',
      },
    },
  });
}

printChartBar();

axios
  // Dev
  // http://localhost:3000/
  // Change for production
  // https://miawallet.herokuapp.com/
  .get('http://localhost:3000/overview/json')
  .then(response => {
    console.log(response);
    const accBalance = response.data.account;
    const amountTrans = response.data.transaction;
    const net = (accBalance + amountTrans).toFixed(2);
    printChartBar(accBalance, amountTrans, net);
  })
  .catch(err => {
    console.log('Error while getting the data: ', err);
  });
