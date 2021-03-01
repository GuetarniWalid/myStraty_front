export function updateBarChart(chart, datas, timeInterval, displayTether, displayBitcoin, displayEthereum) {

  //make an array of dates with timeInterval entries and update "chart.data.labels"
  const timeIntervalToNumber = Number(timeInterval.substring(0, timeInterval.length - 1));
  const lastDays = datas.lastDays.slice(-timeIntervalToNumber);
  chart.data.labels = lastDays;

  //make an array with last BTC values according timeInterval value
  const lastBTCValues = datas.lastBTCValues.slice(-timeIntervalToNumber);

  //make an array with last ETH values according timeInterval value
  const lastETHValues = datas.lastETHValues.slice(-timeIntervalToNumber);

  //make an array with last USDT values according timeInterval value
  const lastUSDTValues = datas.lastUSDTValues.slice(-timeIntervalToNumber);

  const currencyPresent = [];
  chart.data.datasets.forEach((dataset, index) => {
    //store all currencies present in chart
    currencyPresent.push(dataset.label);

    //update last values of currency only if already dispayed
    if (dataset.label === 'USDT') dataset.data = lastUSDTValues;
    if (dataset.label === 'BTC') dataset.data = lastBTCValues;
    if (dataset.label === 'ETH') dataset.data = lastETHValues;
  });

  //remove datas if one currency is unselected
  if (!displayTether && currencyPresent.includes('USDT')) {
    chart.data.datasets.splice(
      chart.data.datasets.findIndex(data => data.label === 'USDT'),
      1
    );
  }
  if (!displayBitcoin && currencyPresent.includes('BTC')) {
    chart.data.datasets.splice(
      chart.data.datasets.findIndex(data => data.label === 'BTC'),
      1
    );
  }
  if (!displayEthereum && currencyPresent.includes('ETH')) {
    chart.data.datasets.splice(
      chart.data.datasets.findIndex(data => data.label === 'ETH'),
      1
    );
  }
  //

  //add datas if one currency is selected
  if (displayTether && !currencyPresent.includes('USDT')) {
    chart.data.datasets.unshift({
      label: 'USDT',
      data: lastUSDTValues,
      backgroundColor: datas.error ? '#E9F0FB' : 'rgba(123,158,113,0.7)',
      borderColor: datas.error ? '#9CB0D4' : 'transparent',
      hoverBorderColor: datas.error ? '#9CB0D4' : undefined,
      borderWidth: 2,
    });
  }
  if (displayBitcoin && !currencyPresent.includes('BTC')) {
    const newData = {
      label: 'BTC',
      data: lastBTCValues,
      backgroundColor: datas.error ? '#E9F0FB' : 'rgba(255,146,1,0.5)',
      borderColor: datas.error ? '#9CB0D4' : 'transparent',
      hoverBackgroundColor: datas.error ? '#E9F0FB' : undefined,
      hoverBorderColor: datas.error ? '#9CB0D4' : undefined,
      borderWidth: 2,
    };
    currencyPresent[0] === 'USDT' ? chart.data.datasets.splice(1, 0, newData) : chart.data.datasets.unshift(newData);
  }
  if (displayEthereum && !currencyPresent.includes('ETH')) {
    chart.data.datasets.push({
      label: 'ETH',
      data: lastETHValues,
      backgroundColor: datas.error ? '#E9F0FB' : 'rgba(140,140,140,0.7)',
      borderColor: datas.error ? '#9CB0D4' : 'transparent',
      hoverBackgroundColor: datas.error ? '#E9F0FB' : undefined,
      hoverBorderColor: datas.error ? '#9CB0D4' : undefined,
      borderWidth: 2,
    });
  }
  //

  chart.update();
}
