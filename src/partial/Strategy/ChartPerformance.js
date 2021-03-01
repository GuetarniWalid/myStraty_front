import React, { useEffect, useRef, useState, useContext } from 'react';
import styles from './ChartPerformance.module.css';
import { createPerformanceChart } from '../../functions/createPerformanceChart';
import { formatNumber } from '../../functions/various';
import { performanceData } from '../../general/initialData/performanceData';
import {DarkContext} from '../Providers'

export default function ChartPerformance({ userStrategy }) {
  const {darkMode} = useContext(DarkContext)
  const chartRef = useRef();
  const [oneYearPerf, setOneOneYearPerf] = useState(0);
  const [error, setError] = useState(false);

  useEffect(() => {
    let mounted = true;
    let chart;
    async function getStratPerformance() {
      let json;
      try {
        const data = await fetch(`${process.env.REACT_APP_URL_BACK}/api/v1/positions/performance/${userStrategy.strategy}`);
        json = await data.json();
      } catch (e) {
        setError(true);
        json = performanceData;
      }
      if(!mounted) return
      //calculate the performance total on 1 year in percent
      const performanceInPercent = ((json[json.length - 1][1] - json[0][1]) / json[0][1]) * 100;
      const performanceInPercentFormat = formatNumber(performanceInPercent, 2);
      setOneOneYearPerf(performanceInPercentFormat);

      chart = await createPerformanceChart(chartRef, json, darkMode, error);
    }
    getStratPerformance();

    return function deleteChart() {
      mounted = false
      // eslint-disable-next-line
      if (chart) chart.destroy();
    };
  }, [error, userStrategy.strategy, darkMode]);

  return (
    <div className={darkMode ? `${styles.chart} ${styles.dark}` : styles.chart}>
      <h4>
        Performance en % sur un an
        <br />
        {!error && <span>
          Total : <span style={darkMode ? {color: '#7db7dc'} : { color: '#3276eb' }}>{oneYearPerf} %</span>
        </span>}
      </h4>
      <canvas id='chart' ref={chartRef} />
    </div>
  );
}
