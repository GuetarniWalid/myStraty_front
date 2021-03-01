import React, { useEffect, useRef, useContext } from 'react';
import styles from './Chart.module.css';
import { DarkContext } from '../Providers';
import { BarChartDataLoad } from '../Providers';
import { StrategyContext } from '../Providers';
import { updateBarChart } from '../../functions/updateBarChart';
import { barChart } from '../../functions/barChart';
import { formatTitleStrat } from '../../functions/various';
import { barChartData as defaultBarChartData } from '../../general/initialData/barChartData';

export default function BarChart({ displayTether, displayBitcoin, displayEthereum, timeIntervalCandle, chartSelected }) {
  const chartRef = useRef();
  const { strategySelected } = useContext(StrategyContext);
  const { barChartDataLoaded, setBarChartDataLoaded } = useContext(BarChartDataLoad);
  const { darkMode } = useContext(DarkContext);
  const chartStored = useRef();
  const firstRenderBar = useRef(true);
  const barChartData = useRef();

  //In first render
  useEffect(() => {
    let mounted = true;
    async function createChart() {
      const { data, error } = await getData(strategySelected);
      if (!mounted) return;

      //In first render, we display a fake chart
      const { lastDays, lastBTCValues, lastETHValues, lastUSDTValues, onlyLastDays, onlyLastBTCValues, onlyLastETHValues, onlyLastUSDTValues } = formatData(data, timeIntervalCandle);
      barChartData.current = {lastDays, lastBTCValues, lastETHValues, lastUSDTValues}

      const context = chartRef.current.getContext('2d');
      chartStored.current = barChart(context, onlyLastDays, onlyLastBTCValues, onlyLastETHValues, onlyLastUSDTValues, error, darkMode);

      setBarChartDataLoaded(true);
    }
    createChart();

    return function deleteChart() {
      mounted = false;
      // eslint-disable-next-line
      barChartDataLoaded && setBarChartDataLoaded(false);
      // eslint-disable-next-line
      if (chartStored.current) chartStored.current.destroy();
    };
    // eslint-disable-next-line
  }, [strategySelected]);

  async function getData(strategySelected) {
    //Get user's trade history
    let data;
    let error = false;
    try {
      const strat = strategySelected === 'TOTAL' ? formatTitleStrat('BTC/ETH/USD LO') : formatTitleStrat(strategySelected);
      const result = await fetch(`${process.env.REACT_APP_URL_BACK}/api/v1/positions/${strat}`);
      data = await result.json();
    } catch (e) {
      data = defaultBarChartData;
      error = true;
    }
    return { data, error };
  }

  function formatData(data, timeInterval) {
    //make an array of dates with 100 last days for future array's update
    const BTCData = data['BTC-USD'];
    const BTCLastDays = BTCData.slice(-100);
    const lastDays = BTCLastDays.map(obj => obj.date);

    //make an array of 100 last BTC values in percent for future array's update
    const lastBTCValues = BTCLastDays.map(obj => obj.value * 100);

    //make an array of 100 last ETH values in percent for future array's update
    const ETHData = data['ETH-USD'];
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

    return { lastDays, lastBTCValues, lastETHValues, lastUSDTValues, onlyLastDays, onlyLastBTCValues, onlyLastETHValues, onlyLastUSDTValues };
  }

  //update barChart
  useEffect(() => {
    function updateBarChartIfNotFirstRender() {
      if (!firstRenderBar.current && chartSelected === 'barChart') {
        updateBarChart(chartStored.current, barChartData.current, timeIntervalCandle, displayTether, displayBitcoin, displayEthereum);
      }
    }
    updateBarChartIfNotFirstRender();
    firstRenderBar.current = false;
    // eslint-disable-next-line
  }, [displayTether, displayBitcoin, displayEthereum, timeIntervalCandle]);

  //update barChart DarkMode
  useEffect(() => {
    //only if barChart is monted
    if (!chartStored.current || !barChartDataLoaded || !chartStored.current.ctx) return;
    chartStored.current.options.tooltips.backgroundColor = darkMode ? '#2e2e3d' : '#fff';
    chartStored.current.options.tooltips.titleFontColor = darkMode ? '#7db7dc' : '#3276EB';
    chartStored.current.options.tooltips.bodyFontColor = darkMode ? '#f3f1ff' : '#8497B8';

    chartStored.current.options.scales.xAxes[0].ticks.fontColor = darkMode ? '#f3f1ff' : '#000';
    chartStored.current.options.scales.yAxes[0].ticks.fontColor = darkMode ? '#f3f1ff' : '#000';

    chartStored.current.options.scales.xAxes[0].gridLines.color = darkMode ? '#47475D' : '#F9FAFA';
    chartStored.current.options.scales.yAxes[0].gridLines.color = darkMode ? '#47475D' : '#F9FAFA';
    chartStored.current.update();

    // eslint-disable-next-line
  }, [darkMode, chartStored.current]);

  return (
    <div className={darkMode ? `${styles.chart} ${styles.dark}` : styles.chart}>
      <canvas id='chart' ref={chartRef} />
    </div>
  );
}
