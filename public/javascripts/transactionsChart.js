function printChart(amounts, categories) {
let ctx = document.getElementById('myChart');
  let myChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
        labels: categories,
        datasets: [{
            label: '',
            data: amounts,
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)'
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 1
        }]
    },
    options: {
      responsive: true,
      legend: {
        position: 'bottom',
      },
      title: {
        display: true,
        text: 'Transactions by Category'
      },
      animation: {
        animateScale: true,
        animateRotate: true
      }
    }
  })
}

axios
    .get(process.env.BASE_URL+'/transactions/json')
    .then(allTransactions => {
      const amounts = allTransactions.data.transaction.map( obj => obj.amount);
      const categories = allTransactions.data.transaction.map( obj => obj.category);
      printChart(amounts, categories)
}).catch(err => console.log("Error while getting the data: ", err))
