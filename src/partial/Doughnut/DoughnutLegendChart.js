import React, {useContext} from 'react';
import DoughnutLegendChartLi from './DoughnutLegendChartLi';
import styles from './DoughnutLegendChart.module.css';
import {formatNumber} from '../../functions/various'
import {DarkContext} from '../Providers'

export default function DoughnutLegendChart({ datas, currencySelected, setCurrencySelected }) {
  const {darkMode} = useContext(DarkContext)

  const doughnutLegendChartLis = datas.map((data, index) => {
    // eslint-disable-next-line
    if (data.pending) return;
    let value;
    if (currencySelected === 'eur') value = formatNumber(data.value, 2);
    if (currencySelected === 'eth') value = formatNumber(data.value, 3);
    if (currencySelected === 'btc') value = formatNumber(data.value, 4);
    return <DoughnutLegendChartLi key={index} name={data.name} value={value} sign={data.sign} color={data.color} currency={data.currency} setCurrencySelected={setCurrencySelected} />;
  });
  return <ul className={darkMode ? `${styles.ul} ${styles.dark}` : styles.ul}>{doughnutLegendChartLis}</ul>;
}
