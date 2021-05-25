import Chart from 'chart.js';
import { fr } from 'date-fns/locale';


export function barChart(context, timeData, BTCValues, ETHValues, USDTValues, error, darkMode) {
  const USDTOptions = {
    label: 'USDT',
    data: USDTValues,
    backgroundColor: error ? '#E9F0FB' : 'rgba(123,158,113,0.7)',
    borderColor: 'transparent',
    hoverBackgroundColor: error ? '#E9F0FB' : undefined,
    borderWidth: 2,
  }

  const BTCOptions = {
    label: 'BTC',
    data: BTCValues,
    backgroundColor: error ? '#E9F0FB' : 'rgba(255,146,1,0.4)',
    borderColor: 'transparent',
    hoverBackgroundColor: error ? '#E9F0FB' : undefined,
    borderWidth: 2,
  }

  const ETHOptions = {
    label: 'ETH',
    data: ETHValues,
    backgroundColor: error ? '#E9F0FB' : 'rgba(140,140,140,0.7)',
    borderColor: 'transparent',
    hoverBackgroundColor: error ? '#E9F0FB' : undefined,
    borderWidth: 2,
  }

  const storage = new Chart(context, {
    type: 'bar',
    responsive: true,
    data: {
      labels: timeData,
      datasets: [USDTOptions, BTCOptions, ETHOptions],
    },
    options: {
      legend: {
        display: false,
      },
      tooltips: {
        // enabled: error ? false : true,
        mode: 'index',
        position: 'nearest',
        backgroundColor: darkMode ? '#2e2e3d' : '#fff',
        titleFontFamily: "'Hind', sans-serif",
        titleFontColor: darkMode ? '#7db7dc' : '#3276EB',  
        titleMarginBottom: 15,
        bodyFontFamily: "'Open Sans', sans-serif",
        bodyFontColor: darkMode ? '#f3f1ff' : '#8497B8',
        bodySpacing: 13,
        xPadding: 15,
        yPadding: 10,
        caretPadding: 10,

        callbacks: {
          title: function (item) {
            return new Date(item[0].xLabel).toLocaleString('fr-FR', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            });
          },
          label: function (tooltipItem) {
            return tooltipItem.value + '%'
          },
        },
      },
      layout: {
        padding: {
          left: 10,
          right: 10,
          top: 10,
          bottom: 10,
        },
      },
      scales: {
        yAxes: [
          {
            stacked: true,
            ticks: {
              padding: 10,
              callback: function (value) {
                if (value === 0) return value;
                if (value === 50 || value === 100) return value + '%';
                return null;
              },
            },
            gridLines: {
              color: darkMode ? '#47475D' : '#F9FAFA',
              drawTicks: false,
              drawBorder: false,
              zeroLineWidth: 0,
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
            stacked: true,
            type: 'time',
            time: {
              unit: 'day',
              displayFormats: {
                day: 'd MMM',
              },
            },
            offset: true,
            gridLines: {
              color: darkMode ? '#47475D' : '#F9FAFA',
              drawBorder: false,
              drawTicks: false,
              zeroLineWidth: 0,
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
