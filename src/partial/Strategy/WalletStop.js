import React, { useContext, useEffect, useState } from 'react';
import { RefreshStrategyContext } from '../Providers';
import { AlertContext } from '../Providers';
import { RateContext } from '../Providers';
import styles from './WalletStop.module.css';
import { formatCurrency } from '../../functions/various';
import useFetch from '../../hooks/useFetch';
import { DarkContext } from '../Providers';
import useFormatDoughnutData from '../../hooks/useFormatDoughnutData';
import {StatusButton} from '../../micro-partial/StatusButton';

export default function WalletStop({ userStrategy, setSrategyStarted, setUserStrategy, setPercentButton, strategy, exchange, changeExchange }) {
  const { setRefresh } = useContext(RefreshStrategyContext);
  const { darkMode } = useContext(DarkContext);
  const { setCard } = useContext(AlertContext);
  const { rate, setRate } = useContext(RateContext);
  const execute = useFetch();
  const formatDoughnutData = useFormatDoughnutData();
  const [statusButton, setstatusButton] = useState('idle')

  async function stopStrategy(e) {
    e.preventDefault();
    setstatusButton('pending')
    try {
      const json = await execute(`${process.env.REACT_APP_URL_BACK}/api/v1/strategies/user/stop/${userStrategy.id}`);
      const success = json.success;
      if (success) {
        setstatusButton('success')
        setSrategyStarted();
        setUserStrategy();
        setRefresh(count => ++count);
        setPercentButton();
        setCard({
          title: `Strategie stoppé !`,
          text: `La strategie ${strategy.title} a été stoppé sur ${exchange.name}.
              Vous pouvez redémarrer la strategie à tout moment en cliquant sur "Lancer".`,
          type: 'success',
          time: 15000,
        });
      }
    } catch (e) {
      console.log(e.message);
    }
  }

  useEffect(() => {
    async function getRates() {
      const data = await formatDoughnutData();
      setRate(data.rate);
    }
    if (Object.keys(rate).length === 0) {
      getRates();
    }
    // eslint-disable-next-line
  }, [rate]);

  //calculate position of each currency in percent
  const position = JSON.parse(userStrategy.position);
  //transform in percent
  const btcPositionInPercent = position.BTC ? position.BTC * 100 : 0;
  const ethPositionInPercent = position.ETH ? position.ETH * 100 : 0;
  const usdPositionInPercent = position.USDT ? position.USDT * 100 : 0;
  const positions = {
    USDT: usdPositionInPercent + '%',
    ETH: ethPositionInPercent + '%',
    BTC: btcPositionInPercent + '%',
  };

  //calculate the amount total allocated to the strategy
  let total = 0;
  total += userStrategy.usdt;
  total += userStrategy.btc * rate.BTCUSDT;
  total += userStrategy.eth * rate.ETHUSDT;
  total = formatCurrency(total, 'usd');

  return (
    <div className={darkMode ? `${styles.container} ${styles.dark}` : styles.container}>
      <div className={styles.exchange}>
        <button onClick={e => changeExchange(e, 'binance')}>Binance</button>
      </div>
      <p>
        Montant sous gestion : <span style={darkMode ? { color: '#7db7dc' } : { color: '#3276eb' }}>$ {total}</span>
      </p>
      <div className={styles.wrapperCurrency}>
        <div>
          <div>
            <p style={usdPositionInPercent ? (darkMode ? { color: '#7db7dc' } : { color: '#3276eb' }) : null}>USD : {formatCurrency(userStrategy.usdt, 'usdt')} $</p>
            <p style={btcPositionInPercent ? (darkMode ? { color: '#7db7dc' } : { color: '#3276eb' }) : null}>BTC : {formatCurrency(userStrategy.btc, 'btc')} ฿</p>
            <p style={ethPositionInPercent ? (darkMode ? { color: '#7db7dc' } : { color: '#3276eb' }) : null}>ETH : {formatCurrency(userStrategy.eth, 'eth')} Ξ</p>
          </div>
        </div>
        <div>
          <div className={styles.leftWrapperCurrency}>
            <p>
              <span style={usdPositionInPercent ? (darkMode ? { color: '#7db7dc' } : { color: '#3276eb' }) : null}>En USD : </span>
              <span style={usdPositionInPercent ? (darkMode ? { color: '#7db7dc' } : { color: '#3276eb' }) : null}>{positions.USDT}</span>
            </p>
            <p>
              <span style={btcPositionInPercent ? (darkMode ? { color: '#7db7dc' } : { color: '#3276eb' }) : null}>En BTC : </span>
              <span style={btcPositionInPercent ? (darkMode ? { color: '#7db7dc' } : { color: '#3276eb' }) : null}>{positions.BTC}</span>
            </p>
            <p>
              <span style={ethPositionInPercent ? (darkMode ? { color: '#7db7dc' } : { color: '#3276eb' }) : null}>En ETH : </span>
              <span style={ethPositionInPercent ? (darkMode ? { color: '#7db7dc' } : { color: '#3276eb' }) : null}>{positions.ETH}</span>
            </p>
          </div>
        </div>
      </div>
      <form>
        <div className={styles.bottomContainer}>
          <StatusButton className={styles.stopButton} handleFunction={stopStrategy} status={statusButton}>
            Arrêter
          </StatusButton>
        </div>
      </form>
    </div>
  );
}
