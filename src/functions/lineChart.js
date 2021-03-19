import Chart from 'chart.js';
import 'chartjs-adapter-date-fns';
import { fr } from 'date-fns/locale';
import constructTooltip from '../functions/constructToolTipLineChart';
import { formatNumber, formatCurrency } from '../functions/various';

export function lineChart(currency, context, dataAsset, timeInterval, displayFakeData, darkMode) {
  const storage = new Chart(context, {
    type: 'line',
    data: {
      labels: timeInterval === '1J' ? dataAsset.labelsByDay : dataAsset.labelsByMonth,
      datasets: [
        {
          label: dataAsset.eur.currency,
          //determine values to dispay according the timeInterval and currency
          data:
            timeInterval === '1J'
              ? currency === 'eur'
                ? dataAsset.eur.valuesByDay
                : currency === 'btc'
                ? dataAsset.btc.valuesByDay
                : dataAsset.eth.valuesByDay
              : currency === 'eur'
              ? dataAsset.eur.valuesByMonth
              : currency === 'btc'
              ? dataAsset.btc.valuesByMonth
              : dataAsset.eth.valuesByMonth,
          //
          backgroundColor: displayFakeData ? 'rgb(233, 240, 251, 0.5)' : currency === 'eur' ? 'rgba(190,212,192,0.5)' : currency === 'btc' ? 'rgba(255,146,1,0.3)' : 'rgba(140,140,140,0.5)',
          borderColor: displayFakeData ? 'rgb(233, 240, 251)' : currency === 'eur' ? 'rgba(123,158,113,1)' : currency === 'btc' ? 'rgba(255,146,1,1)' : 'rgba(57,57,57,1)',
          borderWidth: 1,
          lineTension: 0,
          pointBackgroundColor: displayFakeData ? 'rgb(233, 240, 251)' : currency === 'eur' ? 'rgba(123,158,113,1)' : currency === 'btc' ? 'rgba(255,146,1,1)' : 'rgba(57,57,57,1)',
          pointBorderColor: displayFakeData ? 'rgb(233, 240, 251)' : currency === 'eur' ? 'rgba(123,158,113,1)' : currency === 'btc' ? 'rgba(255,146,1,1)' : 'rgba(57,57,57,1)',
          pointBorderWidth: 0,
          pointRadius: 0,
          pointHitRadius: 5,
          showLine: true,
          pointHoverRadius: 3,
        },
      ],
    },
    options: {
      legend: {
        display: false,
      },
      tooltips: {
        enabled: false,
        xPadding: 10,
        yPadding: 5,
        caretPadding: 10,
        custom: displayFakeData
          ? null
          : function (tooltipModel) {
              const construct = constructTooltip.bind(this);
              construct(tooltipModel, dataAsset, darkMode);
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
            offset: true,
            ticks: {
              padding: 10,
              autoSkipPadding: 20,
              fontColor: darkMode ? '#f3f1ff' : '#000',
              callback: function (value) {
                let valueFormated = value;
                if (value >= 100) valueFormated = formatNumber(value / 1000, 2) + 'k';
                if (currency === 'eur') return '€ ' + formatCurrency(valueFormated, 'eur');
                if (currency === 'btc') return '₿ ' + formatCurrency(valueFormated, 'btc');
                if (currency === 'eth') return 'Ξ ' + formatCurrency(valueFormated, 'eth');
              },
            },
            gridLines: {
              color: darkMode ? '#47475D' : '#F9FAFA',
              drawTicks: false,
              drawBorder: false,
              zeroLineWidth: 0,
              fontColor: darkMode ? '#f3f1ff' : '#000',
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
              unit: timeInterval === '1J' ? 'day' : timeInterval === '1S' ? 'week' : 'month',
              displayFormats: {
                day: 'd MMM',
                week: 'd MMM',
              },
            },
            gridLines: {
              color: darkMode ? '#47475D' : '#F9FAFA',
              drawBorder: false,
              drawTicks: false,
              zeroLineWidth: 0,
            },
            ticks: {
              autoSkipPadding: 10,
              padding: 10,
              maxRotation: 50,
              fontColor: darkMode ? '#f3f1ff' : '#000',
            },
          },
        ],
      },
    },
  });

  return storage;
}
