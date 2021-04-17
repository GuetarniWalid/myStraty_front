import { formatNumber, formatCurrency } from '../functions/various';

export async function updateLineChart(chart, lineChartData, timeInterval, currency, enoughDatas) {
  let valueByTime;
  let labelsByTime;
  let time;
  //For timeInterval change
  switch (timeInterval) {
    case '1J':
      valueByTime = 'valuesByDay'
      labelsByTime = 'labelsByDay'
      time = 'day'
      break;
    case '1S':
      valueByTime = 'valuesByWeek'
      labelsByTime = 'labelsByWeek'
      time = 'week'
      break;
    default:
      valueByTime = 'valuesByMonth'
      labelsByTime = 'labelsByMonth'
      time = 'month'
      break;
  }

  //For currency changes and date
  chart.data.datasets[0].data = lineChartData[currency][valueByTime];
  chart.data.labels = lineChartData[labelsByTime];
  chart.options.scales.xAxes[0].time.unit = time;
  

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
