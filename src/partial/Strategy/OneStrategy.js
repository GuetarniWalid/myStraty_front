import React, { useState, useEffect, useContext } from 'react';
import WalletStart from './WalletStart';
import styles from './OneStrategy.module.css';
import Exchange from './Exchange';
import WalletStop from './WalletStop';
import ChartPerformance from './ChartPerformance';
import ChartPosition from './ChartPosition';
import useFetch from '../../hooks/useFetch'
import {DarkContext} from '../Providers'

export default function OneStrategy({ strategy, dispatchAllocatedAmounts, AllocatedAmounts, totalBinanceBalance, setIsSelected, isSelected, exchange, setExchange }) {
  const [section, setSection] = useState('wallet');
  const [strategyStarted, setSrategyStarted] = useState();
  const [userStrategy, setUserStrategy] = useState();
  const [percentButton, setPercentButton] = useState();
  const execute = useFetch()
  const {darkMode} = useContext(DarkContext)

  useEffect(() => {
    let mounted = true;
    async function isStrategyStarted() {
      try {
        if(!mounted) return
        const json = await execute(`${process.env.REACT_APP_URL_BACK}/api/v1/strategies/user/${strategy.strategy}`);
        setUserStrategy(json.userStrategy);
        setSrategyStarted(json.started);
      }
      catch(e) {
        console.log(e.message)
      }
    }
    isStrategyStarted();

    return () => mounted = false
    // eslint-disable-next-line
  }, [strategy]);

  async function changeExchange(e, name) {
    e.preventDefault();
    e.stopPropagation();
    try {
      const json = await execute(`${process.env.REACT_APP_URL_BACK}/api/v1/exchange/info/${name}`);
      setExchange(json);
    }
    catch(e) {
      console.log(e.message)
    }
  }

  return (
    <div className={darkMode ? `${styles.container} ${styles.dark}` : styles.container} onClick={() => setIsSelected(strategy.title)} style={isSelected === strategy.title ? { flexGrow: 1 } : null}>
      {/* Pagination */}
      {isSelected === strategy.title && (
        <div className={styles.pagination}>
          <span onClick={() => setSection('wallet')} style={section === 'wallet' ? darkMode ? { color: '#7db7dc' } : { color: '#3276eb' } : null}>
            <i className='fas fa-wallet'></i>
          </span>
          <span onClick={() => setSection('position')} style={section === 'position' ? darkMode ? { color: '#7db7dc' } : { color: '#3276eb' } : null}>
            <i className='fas fa-chart-bar'></i>
          </span>
          <span onClick={() => setSection('performance')} style={section === 'performance' ? darkMode ? { color: '#7db7dc' } : { color: '#3276eb' } : null}>
            <i className='fas fa-chart-area'></i>
          </span>
          <span onClick={() => setSection('exchange')} style={section === 'exchange' ? darkMode ? { color: '#7db7dc' } :  { color: '#3276eb' } : null}>
            <i className='fas fa-exchange-alt'></i>
          </span>
        </div>
      )}
      {/******/}
      <div className={styles.wrapper}>
        <div className={styles.titleWrapper}>
          <h3>{strategy.title}</h3>
          <i className='fas fa-ellipsis-v'></i>
        </div>
        {section === 'wallet' && !strategyStarted && (
          <WalletStart
            dispatchAllocatedAmounts={dispatchAllocatedAmounts}
            AllocatedAmounts={AllocatedAmounts}
            totalBinanceBalance={totalBinanceBalance}
            strategy={strategy}
            isSelected={isSelected}
            exchange={exchange}
            setUserStrategy={setUserStrategy}
            setSrategyStarted={setSrategyStarted}
            setPercentButton={setPercentButton}
            percentButton={percentButton}
            changeExchange={changeExchange}
          />
        )}
        {section === 'wallet' && strategyStarted && (
          <WalletStop
            userStrategy={userStrategy}
            setSrategyStarted={setSrategyStarted}
            setUserStrategy={setUserStrategy}
            setPercentButton={setPercentButton}
            strategy={strategy}
            exchange={exchange}
            changeExchange={changeExchange}
          />
        )}
        {section === 'exchange' && <Exchange setExchange={setExchange} exchange={exchange} />}
        {section === 'performance' && <ChartPerformance userStrategy={userStrategy}/> }
        {section === 'position' && <ChartPosition userStrategy={userStrategy}/> }
      </div>
    </div>
  );
}
