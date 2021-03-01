import React from 'react';
import TradeHistory from '../partial/TradeHistory/TradeHistory';
import styles from './History.module.css';

export default function History() {
  return (
    <div className={styles.container}>
      <TradeHistory />
    </div>
  );
}
