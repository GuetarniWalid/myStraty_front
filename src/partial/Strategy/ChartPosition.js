import React, { useEffect, useRef, useState, useContext } from 'react';
import styles from './ChartPosition.module.css';
import { createCurrentPositionChart } from '../../functions/createCurrentPositionChart';
import { currentPosition } from '../../general/initialData/currentPosition';
import { DarkContext } from '../Providers';

export default function ChartPosition({ userStrategy }) {
  const { darkMode } = useContext(DarkContext);
  const chartRef = useRef();
  const [error, setError] = useState(false);

  useEffect(() => {
    let mounted = true;
    let chart;
    async function getStratCurrentPosition() {
      let json;
      try {
        const data = await fetch(`${process.env.REACT_APP_URL_BACK}/api/v1/positions/current/${userStrategy.strategy}`);
        json = await data.json();
      } catch (e) {
        json = currentPosition;
        setError(true);
      }
      if(!mounted) return
      chart = await createCurrentPositionChart(chartRef, json, darkMode, error);
    }
    getStratCurrentPosition();

    return function deleteChart() {
      mounted = false
      // eslint-disable-next-line
      if (chart) chart.destroy();
    };
  }, [error, userStrategy.strategy, darkMode]);

  return (
  <div className={darkMode ? `${styles.chart} ${styles.dark}` : styles.chart}>
      <h4>Allocation par pair en %</h4>
      <canvas id='chart' ref={chartRef} />
    </div>
  );
}
