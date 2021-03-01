import React, {useContext} from 'react';
import UnitSelector from '../../micro-partial/UnitSelector';
import styles from './DoughnutStrategies.module.css';
import {DarkContext} from '../Providers'

export default function DoughnutStrategies({ setStrategy, strategy, dataByStrategy }) {
  const {darkMode} = useContext(DarkContext)

  return (
    <div className={darkMode ? `${styles.container} ${styles.dark}` : styles.container}>
      {
        dataByStrategy.map((strat, index) => {
          //display only active strategies
          return strat.active ? <UnitSelector key={index} selected={strategy === strat.strategy ? true : false} text={strat.strategy} setFunction={setStrategy} dataLoaded /> : null
        })
      }
    </div>
  );
}
