import Chart from 'chart.js';

export function currentPositionChart(context, labels, USDTValues, BTCValues, ETHValues, darkMode, error) {
  const storage = new Chart(context, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [
        {
          barThickness: 60,
          data: [USDTValues, BTCValues, ETHValues],
          backgroundColor: error ? ['rgb(233, 240, 251, 0.7)', 'rgb(233, 240, 251, 0.7)', 'rgb(233, 240, 251, 0.7)'] : ['rgba(123,158,113,0.7)', 'rgba(255,146,1,0.4)', 'rgba(140,140,140,0.7)'],
          hoverBackgroundColor: error ? ['rgb(233, 240, 251, 0.7)', 'rgb(233, 240, 251, 0.7)', 'rgb(233, 240, 251, 0.7)'] : ['rgba(123,158,113,0.7)', 'rgba(255,146,1,0.4)', 'rgba(140,140,140,0.7)'],
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
        legend: {
          display: false,
        },
      tooltips: {
        enabled: error ? false : true,
        mode: 'index',
        position: 'nearest',
        backgroundColor: darkMode ? '#47475D' : '#fff',
        titleFontFamily: "'Hind', sans-serif",
        titleFontColor: darkMode ? '#f3f1ff' : '#3276EB',
        titleMarginBottom: 15,
        bodyFontFamily: "'Open Sans', sans-serif",
        bodyFontColor: darkMode ? '#f3f1ff' : '#8497B8',
        bodySpacing: 13,
        xPadding: 15,
        yPadding: 10,
        caretPadding: 10,

        callbacks: {
          label: function (tooltipItem) {
            return tooltipItem.value + '%'
          },
        },
      },
      scales: {
        yAxes: [
          {
            stacked: true,
            ticks: {
              display: false
            },
            gridLines: {
              display: false,
            },
          },
        ],
        xAxes: [
          {
            gridLines: {
              display: false
            },
            ticks: {
              padding: 10,
            },
          },
        ],
      },
    },
  });

  return storage;
}
