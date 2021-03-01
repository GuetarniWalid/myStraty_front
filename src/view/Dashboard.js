import React from 'react';
import Graphic from '../partial/Chart/Graphic';
import DoughnutGraphic from '../partial/Doughnut/DoughnutGraphic';
import TradeHistory from '../partial/TradeHistory/TradeHistory';
import styles from './Dashboard.module.css';
import TopCards from '../partial/TopCards.js/TopCards';

export default function Dashboard() {

  return (
    <div className={styles.container}>
      <div className={styles.top}>
        <TopCards />
      </div>
      <Graphic />
      <div className={styles.bottom}>
        <DoughnutGraphic />
        <TradeHistory limit={5} />
      </div>
    </div>
  );
}
