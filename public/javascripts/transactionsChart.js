function printChart(amounts, categories) {
  const ctx = document.getElementById('myChart');
  const myChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: categories,
      datasets: [
        {
          label: '',
          data: amounts,
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)',
            'rgba(3, 223, 252, 0.2)',
            'rgba(252, 3, 219, 0.2)',
            'rgba(231, 252, 3, 0.2)',
            'rgba(101, 255, 66, 0.2)',
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)',
            'rgba(3, 223, 252, 1)',
            'rgba(252, 3, 219, 1)',
            'rgba(231, 252, 3, 1)',
            'rgba(101, 255, 66, 1)',
          ],
          borderWidth: 1,
        },
      ],
    },
    options: {
      maintainAspectRatio: false,
      responsive: true,
      legend: {
        position: 'bottom',
      },
      title: {
        display: true,
        text: 'Transactions by Category',
      },
      animation: {
        animateScale: true,
        animateRotate: true,
      },
    },
  });
}

axios
  // localhost
  // Change for production
  .get('https://miawallet.herokuapp.com/transactions/json')
  .then(allTransactions => {
    const amounts = allTransactions.data.transaction.map(obj => obj.amount);
    const categories = allTransactions.data.transaction.map(
      obj => obj.category,
    );
    printChart(amounts, categories);
  })
  .catch(err => console.log('Error while getting the data: ', err));
