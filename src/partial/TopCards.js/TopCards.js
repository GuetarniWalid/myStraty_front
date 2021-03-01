import React, { useState, useContext, useCallback, useEffect } from 'react';
import TotalCard from './TotalCard';
import { CurrencyContext } from '../Providers';
import { WalletByDateContext } from '../Providers';
import { DataByStrategyContext } from '../Providers';
import { WalletContext } from '../Providers';
import { StrategyContext } from '../Providers';
import { EnoughDatasContext } from '../Providers';
import { EnoughtStratDatasContext } from '../Providers';
import { currencyFormat } from '../../general/settings';
import { formatCurrency, formatNumber } from '../../functions/various';

export default function TopCards() {
  const { wallet } = useContext(WalletContext);
  const { walletByDate } = useContext(WalletByDateContext);
  const { dataByStrategy } = useContext(DataByStrategyContext);
  const { currency: currencySelected } = useContext(CurrencyContext);
  const { setStrategySelected } = useContext(StrategyContext);
  const { enoughDatas } = useContext(EnoughDatasContext);
  const { enoughStratDatas } = useContext(EnoughtStratDatasContext);
  const [value, setValue] = useState({ progress: 0, progressInPercent: 0, text: '' });
  const [total, setTotal] = useState({ value: 0, text: '' });
  const [timeInterval, setTimeInterval] = useState('1m');
  const [up, setUp] = useState();
  const [strategy, setStrategy] = useState('TOTAL');

  const changeTimeInterval = useCallback(() => {
    switch (timeInterval) {
      case '1d':
        setTimeInterval('1w');
        break;
      case '1w':
        setTimeInterval('1m');
        break;
      case '1m':
        setTimeInterval('3m');
        break;
      case '3m':
        setTimeInterval('6m');
        break;
      case '6m':
        setTimeInterval('1y');
        break;
      case '1y':
        setTimeInterval('all');
        break;
      default:
        setTimeInterval('1d');
        break;
    }
  }, [timeInterval]);

  //go to the next strategy if not enought datas for strategy selected
  useEffect(() => {
    if (!enoughStratDatas) {
      changeStrategy()
    }
    // eslint-disable-next-line
  }, [enoughStratDatas]);

  const changeStrategy = useCallback(() => {
    //eliminate strategies that are not active or do not have enough data
    const dataByStrategyActive = dataByStrategy.filter(strategy => {
      return strategy.active;
    });
    //if no startegy active, nothing change
    if (!dataByStrategyActive.length) return;

    switch (strategy) {
      case 'TOTAL':
        setStrategy(0);
        setStrategySelected(dataByStrategyActive[0].strategy);
        break;
      default:
        if (strategy < dataByStrategyActive.length - 1) {
          setStrategy(nb => nb + 1);
          setStrategySelected(dataByStrategyActive[strategy + 1].strategy);
        } else {
          setStrategy('TOTAL');
          setStrategySelected('TOTAL');
        }
        break;
    }
    // eslint-disable-next-line
  }, [strategy, dataByStrategy]);

  //determine the total value for the first card
  useEffect(() => {
    let total = 0;
    let text;
    if (dataByStrategy) {
      switch (strategy) {
        case 'TOTAL':
          const values = dataByStrategy.map(strategy => {
            return strategy.btc.value[currencySelected] + strategy.eth.value[currencySelected] + strategy.eur.value[currencySelected];
          });
          total = values.length ? values.reduce((accumulator, currentValue) => accumulator + currentValue) : 0;
          text = 'Total portefeuille';
          break;
        default:
          for (const asset in dataByStrategy[strategy]) {
            if (asset === 'strategy' || asset === 'active') continue;
            total += dataByStrategy[strategy][asset].value[currencySelected];
          }
          text = dataByStrategy[strategy].strategy;
          break;
      }
    }
    total = currencyFormat[currencySelected].sign + ' ' + formatCurrency(total, currencySelected);
    setTotal({ value: total, text: text });
  }, [currencySelected, wallet, strategy, dataByStrategy]);

  //determine the progress values for the second and third card
  useEffect(() => {
    if (walletByDate) {
      const values = walletByDate[currencySelected].valuesByDay;
      let progress;
      let progressInPercent;
      let message;
      switch (timeInterval) {
        case '1d':
          progress = values[values.length - 1] - values[values.length - 2];
          progressInPercent = (progress / values[values.length - 2]) * 100;
          message = 'Depuis 1 jour';
          break;
        case '1w':
          progress = values[values.length - 1] - values[values.length - 8];
          progressInPercent = (progress / values[values.length - 8]) * 100;
          message = 'Depuis 1 semaine';
          break;
        case '1m':
          progress = values[values.length - 1] - values[values.length - 31];
          progressInPercent = (progress / values[values.length - 31]) * 100;
          message = 'Depuis 1 mois';
          break;
        case '3m':
          progress = values[values.length - 1] - values[values.length - 92];
          progressInPercent = (progress / values[values.length - 92]) * 100;
          message = 'Depuis 3 mois';
          break;
        case '6m':
          progress = values[values.length - 1] - values[values.length - 183];
          progressInPercent = (progress / values[values.length - 183]) * 100;
          message = 'Depuis 6 mois';
          break;
        case '1y':
          progress = values[values.length - 1] - values[values.length - 365];
          progressInPercent = (progress / values[values.length - 365]) * 100;
          message = 'Depuis 1 an';
          break;
        default:
          progress = values[values.length - 1] - values[0];
          progressInPercent = (progress / values[0]) * 100;
          message = 'Depuis le debut';
          break;
      }
      //if no value present in time interval we change value for the next
      if (isNaN(progress)) {
        changeTimeInterval();
        return;
      }
      //set "up" to true or false according if "progress" is positive or negative
      Math.sign(progress) === -1 ? setUp(false) : setUp(true);

      //if user has not enought datas, 0 is displaying
      if (!enoughDatas) {
        progress = 0;
        progressInPercent = 0;
      }
      //we format by adding currency sign before the number for "progress" and % after number fot "progressInPercent"
      progress = currencyFormat[currencySelected].sign + ' ' + formatCurrency(progress, currencySelected);
      progressInPercent = formatNumber(progressInPercent, 2) + ' %';
      setValue({ progress, progressInPercent, message });
    }
    // eslint-disable-next-line
  }, [walletByDate, currencySelected, timeInterval]);

  return (
    <>
      <TotalCard value={total.value} text={total.text} handleClick={changeStrategy} up={true} />
      <TotalCard value={value.progress} text={value.message} handleClick={changeTimeInterval} up={up} />
      <TotalCard value={value.progressInPercent} text={value.message} handleClick={changeTimeInterval} up={up} />
    </>
  );
}
