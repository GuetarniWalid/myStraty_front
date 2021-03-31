import React, { useRef, useContext } from 'react';
import Input from '../../micro-partial/Input';
import styles from './Exchange.module.css';
import { RefreshStrategyContext } from '../Providers';
import { AlertContext } from '../Providers';
import { DarkContext } from '../Providers';
import useFetch from '../../hooks/useFetch'

export default function Exchange({ setExchange, exchange }) {
  const { setCard } = useContext(AlertContext);
  const { darkMode } = useContext(DarkContext);
  const containerRef = useRef();
  const formRef = useRef();
  const { setRefresh } = useContext(RefreshStrategyContext);
  const execute = useFetch()

  async function changeExchange(name) {
    try {
      const json = await execute(`${process.env.REACT_APP_URL_BACK}/api/v1/exchange/info/${name}`);
      setExchange(json);
    }
    catch(e) {
      console.log(e.message)
    }
  }

  async function handleTest(e) {
    e.preventDefault();
    try {
      const response = await execute(`${process.env.REACT_APP_URL_BACK}/api/v1/exchange/save`, 'post', {
          name: exchange.name,
          privateKey: formRef.current[0].value,
          publicKey: formRef.current[1].value,
        })
      console.log("🚀 ~ file: Exchange.js ~ line 35 ~ handleTest ~ response", response)
      setExchange(response.exchange);
      setRefresh(count => ++count);
      if (response.success) {
        setCard({
          title: 'Connexion réussi',
          text: `Vous êtes maintenant connecté sur ${exchange.name}, vous pouvez consulter votre solde directement sur la platform`,
          type: 'success',
          time: 6000,
          success: true,
        });
      } else {
        setCard({
          title: 'Connexion échoué',
          text: 'Votre clé publique ou votre clé privée contient une erreur, veuillez les revérifier et tester à nouveau',
          type: 'error',
          time: 6000,
          success: false,
        });
      }
    }
    catch(e) {
      console.log(e.message)
    }
  }

  return (
    <div ref={containerRef} className={darkMode ? `${styles.container} ${styles.dark}` : styles.container}>
      <div>
        <div className={styles.exchangeButton}>
          <button onClick={() => changeExchange('binance')} style={exchange.name === 'binance' ? { color: '#3276eb' } : null}>
            Binance
          </button>
        </div>
        <form ref={formRef}>
          <Input name={'privateKey'} type={'password'} defaultValue={exchange.private_key ?? ''} label={'Clé privée : '} />
          <Input name={'publicKey'} type={'text'} defaultValue={exchange.public_key ?? ''} label={'Clé public : '} />
          <div>
            <button onClick={handleTest}>Tester</button>
            {exchange.tested ? (
              exchange.validate ? (
                <span className={styles.success}>
                  Connecté
                </span>
              ) : (
                <span className={styles.error}>
                  Non Connecté
                </span>
              )
            ) : null}
          </div>
        </form>
      </div>
    </div>
  );
}
