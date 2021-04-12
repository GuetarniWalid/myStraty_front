import React, { useEffect, useRef, useContext, useState } from 'react';
import styles from './WalletStart.module.css';
import Slider from '../../micro-partial/Slider';
import { RefreshStrategyContext } from '../Providers';
import { AlertContext } from '../Providers';
import useFetch from '../../hooks/useFetch';
import {DarkContext} from '../Providers'
import {StatusButton} from '../../micro-partial/StatusButton'

export default function WalletStart({
  dispatchAllocatedAmounts,
  AllocatedAmounts,
  strategy,
  totalBinanceBalance,
  exchange,
  setUserStrategy,
  setSrategyStarted,
  setPercentButton,
  percentButton,
  changeExchange,
}) {
  const [warn, setWarn] = useState(false)
  const [statusButton, setStatusButton] = useState('idle')
  const { setCard } = useContext(AlertContext);
  const startButtonRef = useRef();
  const { setRefresh } = useContext(RefreshStrategyContext);
  const { darkMode } = useContext(DarkContext);
  const execute = useFetch();
  

  useEffect(() => {
    if (AllocatedAmounts[strategy.title] && AllocatedAmounts[strategy.title].reset) setPercentButton();
    // eslint-disable-next-line
  }, [AllocatedAmounts]);

  function handlePercentButton(e, percent) {
    e.preventDefault();
    setPercentButton(percent);
    dispatchAllocatedAmounts({ type: 'percent', strat: strategy.title, totalBalance: totalBinanceBalance, percent });
  }

  function handleAmountAllocated(e) {
    e.preventDefault();
    const value = Number(e.target.value);
    dispatchAllocatedAmounts({ type: 'selector', strat: strategy.title, value: value, totalBalance: totalBinanceBalance });
    setPercentButton();
  }

  async function startStrategy(e) {
    e.preventDefault();
    
    if (!exchange.validate) {
      exchangeInvalid();
      return;
    }
    
    try {
      setStatusButton('pending')
      const response = await execute(`${process.env.REACT_APP_URL_BACK}/api/v1/strategies/user/start`, 'post', {
        amount: AllocatedAmounts[strategy.title].value,
        strat: strategy.title,
        exchange: exchange.name,
        frequency: strategy.frequency,
        reference: strategy.strategy,
      });
      
      if (response.success) {
        setPercentButton();
        setUserStrategy(response.userStrategy);
        setSrategyStarted(response.success);
        setCard({
          title: `Strategie lancé !`,
          text: `La strategie ${strategy.title} a été lancé sur ${exchange.name}.
          Vous pouvez arréter la strategie à tout moment en cliquant sur "Arrêter".`,
          type: 'success',
          time: 15000,
        });
        //set a timout to allow time to Binance to update data
        setTimeout(() => {
          setRefresh(count => ++count);
        }, 1000)
      }
      else if(!response.success && response.details.type === 'management') {
        setStatusButton('error')
        setCard({
          title: `Montant trop petit`,
          text: `Le montant alloué pour une stratégie doit être supérieur à 40 dollars, en dessous l'échange pourrait refuser de passer les ordres`,
          type: 'error',
          time: 15000,
        });
      }
      else {
        setCard({
          title: `Un problème est survenu`,
          text: `Veuillez revérifier vos clés privées et public, si le problème persiste retentez plus tard ou contactez nous, nous repondons au plus vite pour tout problème`,
          type: 'error',
          time: 15000,
        });
      }
    } catch (e) {
      console.log(e.message);
    }
  }


  function exchangeInvalid() {
    startButtonRef.current.classList.add(styles.not);
    setCard({
      title: `${exchange.name.charAt(0).toUpperCase() + exchange.name.slice(1)} non connécté`,
      text: `Vous devez d'abord renseigner une clé privée et une clé public pour ${exchange.name} puis lancer à nouveau`,
      type: 'warning',
      time: 6000,
    });
    setTimeout(() => {
      startButtonRef.current.classList.remove(styles.not);
    }, 300);
  }

  function preventStratIsSoonAvailable(e) {
    e.preventDefault();
    setWarn(true)
    setCard({
      title: `Strategie bientôt disponible !`,
      text: `Cette strategie qui trade aussi à decouvert pour faire des gains même en periode de baisse est bientôt disponible.
      N'hésitez pas à faire savoir que vous la voulez, cela nous motivera à mettre un coup de boost :)`,
      type: 'warning',
      time: 15000,
    });
  }

  return (
    <div className={darkMode ? `${styles.container} ${styles.dark}` : styles.container}>
      <div>
        <div>
          <p>Montant disponible : $ {totalBinanceBalance}</p>
          <p>
            Montant selectionné : <span className={styles.selected}>$ {AllocatedAmounts[strategy.title] ? AllocatedAmounts[strategy.title].value : 0}</span>
          </p>
          <p>Montant restant : $ {AllocatedAmounts[strategy.title] ? AllocatedAmounts[strategy.title].total - AllocatedAmounts[strategy.title].value : 0}</p>
          <p>Selectionnez un montant :</p>
        </div>
        <div className={styles.exchange}>
          <button onClick={e => changeExchange(e, 'binance')}>Binance</button>
        </div>
      </div>
      <form>
        <Slider
          max={AllocatedAmounts[strategy.title] ? AllocatedAmounts[strategy.title].total : 0}
          value={AllocatedAmounts[strategy.title] ? AllocatedAmounts[strategy.title].value : 0}
          handleChange={handleAmountAllocated}
        />
        <div className={styles.bottomContainer}>
          <div className={styles.percentButtonContainer}>
            <button className={percentButton === 25 ? `${styles.percentButton} ${styles.percentButtonSelected}` : styles.percentButton} onClick={e => handlePercentButton(e, 25)}>
              25%
            </button>
            <button className={percentButton === 50 ? `${styles.percentButton} ${styles.percentButtonSelected}` : styles.percentButton} onClick={e => handlePercentButton(e, 50)}>
              50%
            </button>
            <button className={percentButton === 75 ? `${styles.percentButton} ${styles.percentButtonSelected}` : styles.percentButton} onClick={e => handlePercentButton(e, 75)}>
              75%
            </button>
            <button className={percentButton === 100 ? `${styles.percentButton} ${styles.percentButtonSelected}` : styles.percentButton} onClick={e => handlePercentButton(e, 100)}>
              100%
            </button>
          </div>
          {strategy.active ? <StatusButton ref={startButtonRef} status={statusButton} handleFunction={startStrategy} idleStyle={exchange.validate ? { color: '#10b992', background: '#e7faf6', marginRight: '10px' } : { color: '#664d03', background: '#fff3cd', marginRight: '10px' }}>
            Lancer
          </StatusButton>: 
          <StatusButton ref={startButtonRef} status={statusButton} handleFunction={preventStratIsSoonAvailable} idleStyle={exchange.validate ? (warn ? { color: '#664d03', background: '#fff3cd', marginRight: '10px' } : { color: '#10b992', background: '#e7faf6', marginRight: '10px' }) : { color: '#664d03', background: '#fff3cd', marginRight: '10px' }}>
          Lancer
        </StatusButton>
          }
        </div>
      </form>
    </div>
  );
}
