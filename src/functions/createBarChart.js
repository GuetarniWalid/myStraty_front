import { barChart } from './barChart';
import { formatTitleStrat } from '../functions/various'
import {barChartData} from '../general/initialData/barChartData'

export async function createBarChart(chartRef, chartStored, strategySelected, timeInterval, darkMode) {
    //Get user's trade history   
    let json;
    let error = false;
    try {
      const strat = strategySelected === 'TOTAL' ? formatTitleStrat('BTC/ETH/USD LO') : formatTitleStrat(strategySelected)
      const data = await fetch(`${process.env.REACT_APP_URL_BACK}/api/v1/positions/${strat}`);
      json = await data.json();
    }
    catch(e) {
      json = barChartData
      error = true
    }

  //make an array of dates with 100 last days for future array's update
  const BTCData = json['BTC-USD'];
  const BTCLastDays = BTCData.slice(-100);
  const lastDays = BTCLastDays.map(obj => obj.date);

  //make an array of 100 last BTC values in percent for future array's update
  const lastBTCValues = BTCLastDays.map(obj => obj.value * 100);

  //make an array of 100 last ETH values in percent for future array's update
  const ETHData = json['ETH-USD'];
  const ETHLastDays = ETHData.slice(-100);
  const lastETHValues = ETHLastDays.map(obj => obj.value * 100);

  //make an array of 100 last USDT values in percent for future array's update
  const lastUSDTValues = lastBTCValues.map((value, index) => {
    return 100 - value - lastETHValues[index];
  });

  //for the first display, get only last item of each array according timeInterval
  const timeIntervalToNumber = Number(timeInterval.substring(0, timeInterval.length - 1));
  const onlyLastDays = lastDays.slice(-timeIntervalToNumber);
  const onlyLastBTCValues = lastBTCValues.slice(-timeIntervalToNumber);
  const onlyLastETHValues = lastETHValues.slice(-timeIntervalToNumber);
  const onlyLastUSDTValues = lastUSDTValues.slice(-timeIntervalToNumber);


  const context = chartRef.current.getContext('2d');
  chartStored.current = await barChart(context, onlyLastDays, onlyLastBTCValues, onlyLastETHValues, onlyLastUSDTValues, error, darkMode);

  return { lastDays, lastBTCValues, lastETHValues, lastUSDTValues, error };
}
