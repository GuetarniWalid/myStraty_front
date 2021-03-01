import React, { useState, useContext } from 'react';
import GraphicHeader from './GraphicHeader';
import styles from './Graphic.module.css';
import LegendChart from './LegendChart';
import Title from '../../micro-partial/Title';
import { StrategyContext } from '../Providers';
import {DarkContext} from '../Providers'
import LineChart from './LineChart';
import BarChart from './BarChart';

export default function Graphic({lineChartData, setLineChartData}) {
  const { strategySelected } = useContext(StrategyContext);
  const { darkMode } = useContext(DarkContext);
  const [chartSelected, setChartSelected] = useState('lineChart');
  const [timeIntervalPortfolio, setTimeIntervalPortfolio] = useState('1J');
  const [timeIntervalCandle, setTimeIntervalCandle] = useState('10J');
  const [displayTether, setDisplayTether] = useState(true);
  const [displayBitcoin, setDisplayBitcoin] = useState(true);
  const [displayEthereum, setDisplayEthereum] = useState(true);

  //handle selection between Portfolio and Position
  function selectedGraph(type) {
    if (type === 'barChart') {
      // setTimeIntervalCandle('10J');
      setChartSelected('barChart')
    } else if (type === 'lineChart') {
      setChartSelected('lineChart')
    }
  }

  return (
    <div className={darkMode ? `${styles.container} ${styles.dark}` : styles.container} >
      <Title>Resumé</Title>
      <div className={styles.graphicHeader}>
        <GraphicHeader selected={chartSelected === 'lineChart'} selectedGraph={selectedGraph} title={strategySelected} type='lineChart' />
        <GraphicHeader selected={chartSelected === 'barChart'} selectedGraph={selectedGraph} title={chartSelected === 'barChart' ? strategySelected === 'TOTAL' ? 'BTC/ETH/USD LO' : strategySelected : 'POSITIONS'} type='barChart' />
      </div>
      <LegendChart
        displayEthereum={displayEthereum}
        displayBitcoin={displayBitcoin}
        displayTether={displayTether}
        setDisplayEthereum={setDisplayEthereum}
        setDisplayBitcoin={setDisplayBitcoin}
        setDisplayTether={setDisplayTether}
        timeIntervalCandle={timeIntervalCandle}
        setTimeIntervalCandle={setTimeIntervalCandle}
        setTimeIntervalPortfolio={setTimeIntervalPortfolio}
        timeIntervalPortfolio={timeIntervalPortfolio}
        chartSelected={chartSelected}
      />
      {chartSelected === 'lineChart' && <LineChart
        lineChartData={lineChartData}
        setLineChartData={setLineChartData}
        timeIntervalPortfolio={timeIntervalPortfolio}
      />}
      {chartSelected === 'barChart' && <BarChart
        lineChartData={lineChartData}
        setLineChartData={setLineChartData}
        displayTether={displayTether}
        displayBitcoin={displayBitcoin}
        displayEthereum={displayEthereum}
        timeIntervalCandle={timeIntervalCandle}
        chartSelected={chartSelected}
      />}
    </div>
  );
}
