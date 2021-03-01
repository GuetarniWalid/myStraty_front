import Chart from 'chart.js';
import 'chartjs-adapter-date-fns';
import { fr } from 'date-fns/locale';
import {formatNumber} from '../functions/various'

export async function performanceChart(context, labels, dataAssets, darkMode, error) {
  const storage = new Chart(context, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [
        {
          data: dataAssets,
          backgroundColor: error? 'rgb(233, 240, 251, 0.5)' : darkMode ? 'rgba(125, 183, 220, 0.7)' : 'rgba(50, 118, 235, 0.2)',
          borderColor: error? 'rgb(233, 240, 251, 0.5)' : darkMode ? 'rgba(125, 183, 220, 0.7)' : 'rgba(50, 118, 235, 0.2)',
          borderWidth: 1,
          pointBackgroundColor: error? 'rgb(233, 240, 251, 0.5)' : darkMode ? 'rgba(125, 183, 220, 1)' : 'rgba(50, 118, 235, 0.2)',
          pointBorderColor: error? 'rgb(233, 240, 251, 0.5)' : darkMode ? 'rgba(125, 183, 220, 1)' : 'rgba(50, 118, 235, 0.2)',
          pointBorderWidth: 0,
          pointRadius: 0,
          pointHitRadius: 5,
          showLine: true,
          pointHoverRadius: 3,
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
        enabled: error? false : true,
        xPadding: 10,
        yPadding: 10,
        caretPadding: 10,
        backgroundColor: darkMode ? '#47475D' : '#fff',
        titleFontColor: darkMode ? '#f3f1ff' : '#9cb0d4',
        bodyFontColor: darkMode ? '#f3f1ff' : '#9cb0d4',
        callbacks: {
          label: function(tooltipItem, data) {
            const performanceInPercent = (Number(tooltipItem.value) - data.datasets[0].data[0]) / data.datasets[0].data[0] * 100
            return ' ' + formatNumber(performanceInPercent, 2) + ' %'
          }
        }
      },
      scales: {
        yAxes: [
          {
            ticks: {
              display: false,
            },
            gridLines: {
              display: false,
            },
          },
        ],
        xAxes: [
          {
            adapters: {
              date: {
                locale: fr,
              },
            },
            type: 'time',
            time: {
              unit: 'day',
              tooltipFormat: 'd MMM y',
            },
            gridLines: {
              display: false,
            },
            ticks: {
              display: false,
            },
          },
        ],
      },
    },
  });

  return storage;
}
