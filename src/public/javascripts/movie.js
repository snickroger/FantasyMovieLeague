window.onload = function () {
  var ctx = document.getElementById('earnings-chart').getContext('2d');
  window.chart = new Chart(ctx, chartOptions(chartData));
}

function chartOptions(earningPoints) {
  return {
    type: 'line',
    data: {
      datasets: [{
        label: 'Total Earnings',
        fill: false,
        data: earningPoints,
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
        borderColor: 'rgb(54, 162, 235)'
      }]
    },
    options: {
      scales: {
        xAxes: [{
          type: 'time',
          scaleLabel: {
            display: true,
            labelString: 'Date'
          }
        }],
        yAxes: [{
          scaleLabel: {
            display: true,
            labelString: 'Revenue (USD)'
          },
          ticks: {
            beginAtZero: true,
            callback: function (value, index, values) {
              return formatAxis(value);
            }
          }
        }]
      },
      tooltips: {
        callbacks: {
          label: function (tooltipItem, data) {
            var label = data.datasets[tooltipItem.datasetIndex].label || '';

            if (label) {
              label += ': ';
            }
            label += accounting.formatMoney(tooltipItem.yLabel, '$', 0);
            return label;
          }
        }
      }
    }
  }
}

function formatAxis(value) {
  if (value >= 1e9)
    return "$" + (value / 1e9).toPrecision(3) + "b";
  if (value >= 1e6)
    return "$" + (value / 1e6).toPrecision(3) + "m";
  if (value >= 1e3)
    return "$" + (value / 1e3).toPrecision(3) + "k";
  return "$" + value.toString();
}