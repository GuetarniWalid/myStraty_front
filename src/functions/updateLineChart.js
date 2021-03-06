import {formatNumber, formatCurrency} from '../functions/various'

export async function updateLineChart(chart, lineChartData, timeInterval, currency, enoughDatas, darkMode) {
  let eur;
  let btc;
  let eth;
  //For timeInterval change
  switch (timeInterval) {
    case '1J':
      eur = lineChartData.eur.valuesByDay;
      btc = lineChartData.btc.valuesByDay;
      eth = lineChartData.eth.valuesByDay;

      //change lineChart with new value
      chart.data.labels = lineChartData.labelsByDay;
      chart.options.scales.xAxes[0].time.unit = 'day';
      break;
    case '1S':
      eur = lineChartData.eur.valuesByWeek;
      btc = lineChartData.btc.valuesByWeek;
      eth = lineChartData.eth.valuesByWeek;

      //change lineChart with new value
      chart.data.labels = lineChartData.labelsByWeek;
      chart.options.scales.xAxes[0].time.unit = 'week';
      break;
    default:
      eur = lineChartData.eur.valuesByMonth;
      btc = lineChartData.btc.valuesByMonth;
      eth = lineChartData.eth.valuesByMonth;

      //change lineChart with new value
      chart.data.labels = lineChartData.labelsByMonth;
      chart.options.scales.xAxes[0].time.unit = 'month';
      break;
  }

  //For currency changes
  chart.data.datasets[0].data = currency === 'eur' ? eur : currency === 'btc' ? btc : eth;
  chart.data.datasets[0].borderColor = !enoughDatas ? 'rgb(233, 240, 251)' : currency === 'eur' ? 'rgba(123,158,113,1)' : currency === 'btc' ? 'rgba(255,146,1,1)' : 'rgba(57,57,57,1)';
  chart.data.datasets[0].backgroundColor = !enoughDatas
    ? 'rgb(233, 240, 251, 0.5)'
    : currency === 'eur'
    ? 'rgba(190,212,192,0.5)'
    : currency === 'btc'
    ? 'rgba(255,146,1,0.3)'
    : 'rgba(140,140,140,0.5)';
  chart.data.datasets[0].pointBackgroundColor = !enoughDatas ? 'rgb(233, 240, 251)' : currency === 'eur' ? 'rgba(123,158,113,1)' : currency === 'btc' ? 'rgba(255,146,1,1)' : 'rgba(57,57,57,1)';
  chart.data.datasets[0].pointBorderColor = !enoughDatas ? 'rgb(233, 240, 251)' : currency === 'eur' ? 'rgba(123,158,113,1)' : currency === 'btc' ? 'rgba(255,146,1,1)' : 'rgba(57,57,57,1)';
  chart.options.scales.yAxes[0].ticks.callback = addCurrencySign;

  //function change currency sign in yAxis
  function addCurrencySign(value) {
    let valueFormated = value;
    if (value >= 100) valueFormated = formatNumber(value / 1000, 2) + 'k';
    if (currency === 'eur') return '€ ' + formatCurrency(valueFormated, 'eur');
    if (currency === 'btc') return '₿ ' + formatCurrency(valueFormated, 'btc');
    if (currency === 'eth') return 'Ξ ' + formatCurrency(valueFormated, 'eth');
  }

  chart.update();
}
