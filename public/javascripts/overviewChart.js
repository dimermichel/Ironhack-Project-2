
    function printChartBar(accBalance, amountTrans) {
      var ctx2 = document.getElementById('myChart2').getContext('2d');
			window.myHorizontalBar = new Chart(ctx2, {
				type: 'horizontalBar',
				data: {
          labels: ['Overview'],
          datasets: [{
            label: 'Expenses',
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgba(255, 99, 132, 0.2)',
            borderWidth: 1,
            data: [
              amountTrans
            ]
          }, {
            label: 'Income',
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderColor: 'rgba(54, 162, 235, 0.2)',
            data: [
              accBalance
            ]
          }]
        },
				options: {
					// Elements options apply to all of the options unless overridden in a dataset
					// In this case, we are setting the border of each horizontal bar to be 2px wide
					elements: {
						rectangle: {
							borderWidth: 2,
						}
          },
          maintainAspectRatio: false,
					responsive: true,
					legend: {
						position: 'right',
					},
					title: {
						display: true,
						text: 'Finance Overview'
					}
				}
			});
      }
      
      printChartBar()

      axios
          //localhost
          //Change for production
          .get('http://localhost:3000/overview/json')
          .then(response => {
            console.log(response)
            const accBalance = response.data.account;
            const amountTrans = response.data.transaction;
            printChartBar(accBalance, amountTrans)
      }).catch(err => {
        console.log("Error while getting the data: ", err)
      })