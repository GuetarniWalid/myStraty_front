import React, {useContext} from 'react';
import styles from './LegendChart.module.css';
import UnitSelector from '../../micro-partial/UnitSelector';
import {DarkContext} from '../Providers'
import {LineChartDataLoad} from '../Providers'
import {BarChartDataLoad} from '../Providers'

export default function LegendChart({displayEthereum, displayBitcoin, displayTether, setDisplayEthereum, setDisplayBitcoin, setDisplayTether, timeIntervalCandle, setTimeIntervalCandle, timeIntervalPortfolio, setTimeIntervalPortfolio, chartSelected}) {
  const {darkMode} = useContext(DarkContext)
  const {lineChartDataLoaded} = useContext(LineChartDataLoad)
  const {barChartDataLoaded} = useContext(BarChartDataLoad)

  return (
    <div className={darkMode ? `${styles.container} ${styles.dark}` : styles.container}>
      <div className={styles.time}>
        {chartSelected === 'lineChart' && 
        <>
        <UnitSelector selected={timeIntervalPortfolio === '1J'} text='1J' setFunction={setTimeIntervalPortfolio} dataLoaded={lineChartDataLoaded} />
        <UnitSelector selected={timeIntervalPortfolio === '1S'} text='1S' setFunction={setTimeIntervalPortfolio} dataLoaded={lineChartDataLoaded} />
        <UnitSelector selected={timeIntervalPortfolio === '1M'} text='1M' setFunction={setTimeIntervalPortfolio} dataLoaded={lineChartDataLoaded} />
        </>
        }
        {chartSelected === 'barChart' && 
        <>
        <UnitSelector selected={timeIntervalCandle === '10J'} text='10J' setFunction={setTimeIntervalCandle} dataLoaded={barChartDataLoaded} />
        <UnitSelector selected={timeIntervalCandle === '30J'} text='30J' setFunction={setTimeIntervalCandle} dataLoaded={barChartDataLoaded} />
        <UnitSelector selected={timeIntervalCandle === '50J'} text='50J' setFunction={setTimeIntervalCandle} dataLoaded={barChartDataLoaded} />
        <UnitSelector selected={timeIntervalCandle === '100J'} text='100J' setFunction={setTimeIntervalCandle} dataLoaded={barChartDataLoaded} />
        </>
        }
      </div>
      <div className={styles.currency}>
        {chartSelected === 'barChart' ? <span onClick={() => setDisplayTether(state => !state)} className={displayTether ? styles.eur : styles.unselected} style={{cursor: 'pointer'}}>Tether</span> : <span className={styles.eur}>Euros</span>}
        {chartSelected === 'barChart' ? <span onClick={() => setDisplayBitcoin(state => !state)} className={displayBitcoin ? styles.btc : styles.unselected} style={{cursor : 'pointer'}}>Bitcoin</span> : <span className={styles.btc}>Bitcoin</span>}
        {chartSelected === 'barChart' ? <span onClick={() => setDisplayEthereum(state => !state)} className={displayEthereum ? styles.eth : styles.unselected} style={{cursor:'pointer'}}>Ethereum</span> : <span className={styles.eth}>Ethereum</span>}
      </div>
    </div>
  );
}
