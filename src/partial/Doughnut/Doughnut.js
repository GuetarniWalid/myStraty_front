import React, { useState, useEffect, useContext } from 'react';
import DoughnutPart from './DoughnutPart';
import styles from './Doughnut.module.css';
import { formatCurrency } from '../../functions/various';
import { RateContext } from '../Providers';
import { DataByStrategyContext } from '../Providers';
import { WalletContext } from '../Providers';
import { currencyFormat } from '../../general/settings';
import useFormatDoughnutData from '../../hooks/useFormatDoughnutData';
import {DarkContext} from '../Providers'

export default function Doughnut({ datas, setDatas, setCurrencySelected, currencySelected, byCoin, strategy, noStratActive }) {
  const [dataBrut, setDataBrut] = useState();
  const [sign, setSign] = useState();
  const rayon = (10 / 2) * Math.PI;
  //to make prices accessible at global level
  const { setRate } = useContext(RateContext);
  const { setWallet } = useContext(WalletContext);
  const { darkMode } = useContext(DarkContext);
  //
  //to serve data by strategy to "TotalCard"
  const { setDataByStrategy } = useContext(DataByStrategyContext);
  //
  const formatDoughnutData = useFormatDoughnutData();

  useEffect(() => {
    let mounted = true;
    async function getDoughnutData() {
      try {
        const data = await formatDoughnutData();
        //to avoid states change if the component is unmonted
        if (!mounted) return;

        if (Object.keys(data).length) {
          setDataByStrategy(data.arrayOfEachStrategy);
          setDataBrut(data);
          setRate(data.rate);
          setWallet(data.allStrategiesFormated);
        }
      } catch (e) {
        return;
      }
    }
    getDoughnutData();

    //cleanup function
    return () => mounted = false
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (dataBrut) {
      //reformat data for the strategy selected with "dataBrut"
      let data;
      if (byCoin) data = dataBrut.allStrategiesFormated;
      else {
        data = dataBrut.arrayOfEachStrategy.find(obj => obj.strategy === strategy);
      }

      const dataFormated = [];
      for (const asset in data) {
        if (!byCoin && (asset === 'strategy' || asset === 'active')) continue;
        dataFormated.push({
          name: data[asset].name,
          currency: asset,
          value: data[asset].value[currencySelected],
          color: data[asset].color,
          sign: data[currencySelected].sign,
        });
      }
      setDatas(dataFormated);
      setSign(data[currencySelected].sign);
    }
    // eslint-disable-next-line
  }, [dataBrut, currencySelected, byCoin, strategy, darkMode]);

  //calculation of all datas value to transform in percent
  let total = 0;
  datas.forEach(data => {
    total += Number(data.value);
  });
  const datasInPercent = datas.map(data => ({ ...data, value: (data.value / total) * 100 }));

  const doughnuts = datasInPercent.map((data, index) => {
    return (
      <DoughnutPart
        key={index}
        size={data.value}
        position={index}
        color={data.color}
        datas={datasInPercent}
        rayon={rayon}
        strokeWidth='8'
        currency={data.currency}
        setCurrencySelected={setCurrencySelected}
        currencySelected={currencySelected}
        noStratActive={noStratActive}
        />
        );
      });
      
  return (
    <div className={darkMode ? `${styles.container} ${styles.dark}`  : styles.container}>
      <svg className={styles.doughnut} width='90%' height='90%' viewBox='0 0 50 50'>
        {doughnuts}

        {/*this circle is superimposed and comes to cover the center of all the other circles to prevent certain bugs */}
        <circle cx='25' cy='25' r={rayon} fill='transparent' />
      </svg>
      <span className={styles.total}>
        {datas[0].pending === undefined && sign}
        {datas[0].pending === undefined && formatCurrency(total, currencySelected)}
        <br />
        {datas[0].pending === undefined && !noStratActive ? <span>total en {currencyFormat[currencySelected].shortName}</span> : <span>Aucune strategie activée</span>}
      </span>
    </div>
  );
}
