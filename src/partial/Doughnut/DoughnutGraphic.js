import React, { useState, useContext } from 'react';
import GraphicHeader from '../Chart/GraphicHeader';
import Doughnut from './Doughnut';
import styles from './DoughnutGraphic.module.css';
import DoughnutLegendChart from './DoughnutLegendChart';
import DoughnutStrategies from './DoughnutStrategies';
import { CurrencyContext } from '../Providers';
import { DataByStrategyContext } from '../Providers';
import Title from '../../micro-partial/Title';
import { useEffect } from 'react';
import {DarkContext} from '../Providers'

export default function DoughnutGraphic() {
  const { currency } = useContext(CurrencyContext);
  const { dataByStrategy } = useContext(DataByStrategyContext);
  const { darkMode } = useContext(DarkContext);
  const [byCoin, setByCoin] = useState(true);
  const [byStrategy, setByStrategy] = useState(false);
  const [datas, setDatas] = useState([{ value: 1, color: darkMode ? '#47475D' : '#E9F0FB', pending: true }]);
  const [currencySelected, setCurrencySelected] = useState(currency);
  const [strategy, setStrategy] = useState();
  const [noStratActive, setNoStratActive] = useState(true);

  useEffect(() => {
    //when doughnut by strategy selected, focus on first strat wich is active
    const stratActive = dataByStrategy.find(strat => strat.active);
    if (stratActive) {
      setStrategy(stratActive.strategy);
      setNoStratActive(false);
    } 
    else setNoStratActive(true);
    // eslint-disable-next-line
  }, [dataByStrategy]);

  //handle selection between Portfolio and Position
  function selectedGraph(type) {
    if (type === 'perCoin') {
      setByCoin(true);
      setByStrategy(false);
    } else if (type === 'perStrat') {
      setByCoin(false);
      setByStrategy(true);
    }
  }

  return (
    <div className={darkMode ? `${styles.container} ${styles.dark}` : styles.container}>
      <Title>Portefeuille</Title>
      <div className={styles.headerContainer}>
        <GraphicHeader selected={byCoin} selectedGraph={selectedGraph} title='PAR COINS' type='perCoin'/>
        {!noStratActive && <GraphicHeader selected={byStrategy} selectedGraph={selectedGraph} title='PAR STRATEGIE' type='perStrat'/>}
      </div>
      {byStrategy && <DoughnutStrategies setStrategy={setStrategy} strategy={strategy} dataByStrategy={dataByStrategy} />}
      <div className={styles.containerDoughnut} style={noStratActive ? { borderTopRightRadius: '5px' } : null}>
        <Doughnut datas={datas} setDatas={setDatas} setCurrencySelected={setCurrencySelected} currencySelected={currencySelected} byCoin={byCoin} strategy={strategy} noStratActive={noStratActive} />
        <DoughnutLegendChart datas={datas} currencySelected={currencySelected} setCurrencySelected={setCurrencySelected} />
      </div>
    </div>
  );
}
