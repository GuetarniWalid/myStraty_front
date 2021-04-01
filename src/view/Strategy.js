import React, { useEffect, useState, useReducer, useContext } from 'react';
import OneStrategy from '../partial/Strategy/OneStrategy';
import styles from './Strategy.module.css';
import useWindowSize from '../hooks/useWindowSize';
import { RefreshStrategyContext } from '../partial/Providers';
import useFetch from '../hooks/useFetch';

function reducer(state, action) {
  switch (action.type) {
    case 'init':
      const initialState = {};
      action.strategies.forEach(
        strat =>
          (initialState[strat] = {
            value: 0,
            total: action.total,
          })
      );
      return initialState;
    case 'selector':
      const newState = {};
      let remainingValue = action.totalBalance;
      for (const strat in state) {
        if (strat !== action.strat) remainingValue -= state[strat].value;
        else remainingValue -= action.value;
      }
      for (const strat in state) {
        if (strat !== action.strat)
          newState[strat] = {
            value: state[strat].value,
            total: remainingValue + state[strat].value,
            reset: true,
          };
        else
          newState[strat] = {
            value: action.value,
            total: remainingValue + action.value,
            reset: true,
          };
      }
      return newState;
    default:
      const calculatedState = { ...state };
      let calculatedRemainingValue = action.totalBalance;
      for (const strat in state) {
        if (strat !== action.strat) calculatedRemainingValue -= state[strat].value;
        else calculatedRemainingValue -= (action.totalBalance * action.percent) / 100;
      }
      for (const strat in state) {
        if (strat === action.strat) {
          calculatedState[strat] = {
            value: parseInt((action.totalBalance * action.percent) / 100),
            total: calculatedRemainingValue >= 0 ? calculatedRemainingValue + parseInt((action.totalBalance * action.percent) / 100) : action.totalBalance,
          };
        } else {
          calculatedState[strat] = {
            value: calculatedRemainingValue >= 0 ? calculatedState[strat].value : 0,
            total: calculatedRemainingValue >= 0 ? calculatedRemainingValue + state[strat].value : action.totalBalance - (action.totalBalance * action.percent) / 100,
            reset: calculatedRemainingValue >= 0 ? false : true,
          };
        }
      }
      return calculatedState;
  }
}

export default function Strategy() {
  const [totalBinanceBalance, setTotalBinanceBalance] = useState(0);
  const [isSelected, setIsSelected] = useState();
  const [strategies, setStrategies] = useState([]);
  const [exchange, setExchange] = useState({ name: 'binance' });
  const [height, setHeight] = useState(0);
  const [AllocatedAmounts, dispatchAllocatedAmounts] = useReducer(reducer, {});
  const size = useWindowSize();
  const { refresh } = useContext(RefreshStrategyContext);
  const execute = useFetch();

  useEffect(() => {
    let mounted = true;
    async function getExchangeAmountAndStrategies() {
      try {
        const [usdt, newExchange, strategies] = await Promise.all([
          execute(`${process.env.REACT_APP_URL_BACK}/api/v1/exchange/balance/usdt/${exchange.name}`).then(usdt => parseInt(usdt)),
          execute(`${process.env.REACT_APP_URL_BACK}/api/v1/exchange/info/${exchange.name}`),
          fetch(`${process.env.REACT_APP_URL_BACK}/api/v1/strategies`).then(data => data.json()),
        ]);
        console.log("🚀 ~ file: Strategy.js ~ line 87 ~ getExchangeAmountAndStrategies ~ usdt", usdt)
        //to avoid states change if the component is unmonted
        if (!mounted) return;
        
        setExchange(newExchange);
        setTotalBinanceBalance(usdt);
        setStrategies(strategies);

        const stratTitles = strategies.map(strategy => strategy.title);
        dispatchAllocatedAmounts({ type: 'init', strategies: stratTitles, total: usdt });
      } catch (e) {
        console.log(e.message);
      }
    }
    getExchangeAmountAndStrategies();

    //cleanup function
    return () => mounted = false
    // eslint-disable-next-line
  }, [exchange.name, refresh]);

  useEffect(() => {
    let height;
    if (size.width > 500) {
      height = strategies.length * 210 + 'px';
    } else if (size.width > 300) {
      height = strategies.length * 255 + 'px';
    }
    setHeight(height);
  }, [size, strategies]);

  const strats = strategies.map((strategy, index) => (
    <OneStrategy
      key={index}
      index={index}
      dispatchAllocatedAmounts={dispatchAllocatedAmounts}
      AllocatedAmounts={AllocatedAmounts}
      totalBinanceBalance={totalBinanceBalance}
      strategy={strategy}
      setIsSelected={setIsSelected}
      isSelected={isSelected}
      exchange={exchange}
      setExchange={setExchange}
    />
  ));

  return (
    <div className={styles.container}>
      <div style={{ height: height }}>{strats}</div>
    </div>
  );
}
