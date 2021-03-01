import React, { useContext, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import TopbarCurrency from './TopbarCurrency';
import styles from './Topbar.module.css';
import { CurrencyContext } from '../Providers';
import TopbarSettings from './TopbarSettings';
import useFetch from '../../hooks/useFetch';
import { LoggedInContext } from '../Providers';
import { SubscribeContext } from '../Providers';
import { DarkContext } from '../Providers';

let title;
let logo;

export default function Topbar() {
  const [settings, setSettings] = useState(false);
  const [bellActive, setBellActive] = useState(false);
  const [mail, setMail] = useState(true);
  const location = useLocation();
  const { currency, setCurrency } = useContext(CurrencyContext);
  const { setLoggedIn } = useContext(LoggedInContext);
  const { isSubscribe } = useContext(SubscribeContext);
  const { darkMode } = useContext(DarkContext);

  const execute = useFetch();

  if (location.pathname === '/console/dashboard') {
    title = 'Dashboard';
    logo = <i className='fas fa-th-large'></i>;
  }
  if (location.pathname === '/console/strategie') {
    title = 'Strategie';
    logo = <i className='fas fa-chart-line'></i>;
  }
  if (location.pathname === '/console/historique') {
    title = 'Historique';
    logo = <i className='fas fa-history'></i>;
  }
  if (location.pathname === '/console/communaute') {
    title = 'Communauté';
    logo = <i className='fas fa-comment'></i>;
  }
  if (location.pathname === '/console/abonnement') {
    title = "S'abonner";
    logo = <i className='fas fa-receipt'></i>;
  }

  //get user settings in database
  useEffect(() => {
    let mounted = true;
    async function getSettings() {
      try {
        const json = await execute(`${process.env.REACT_APP_URL_BACK}/api/v1/settings`);
        //to avoid states change if the component is unmonted
        if (!mounted) return;
        const isSendMailActive = json.send_mail;
        setBellActive(isSendMailActive);
      } catch (e) {
        console.log(e.message);
      }
    }
    getSettings();

    //cleanup function
    return () => (mounted = false);
    // eslint-disable-next-line
  }, []);

  function handleMail(e) {
    e.preventDefault();
    try {
      execute(`${process.env.REACT_APP_URL_BACK}/api/v1/settings`, 'post', { sendMail: !mail });
      setMail(state => !state);
      setBellActive(state => !state);
    } catch (e) {
      console.log(e.message);
    }
  }

  function deconnexion() {
    localStorage.removeItem('userId');
    localStorage.removeItem('token');
    setLoggedIn(false);
  }

  return (
    <header className={darkMode ? `${styles.header} ${styles.dark}` : `${styles.header} ${styles.light}`}>
      <div className={styles.left}>
        {isSubscribe && (
          <>
            <TopbarCurrency logo={'fas fa-euro-sign'} styles={styles} selected={currency === 'eur'} currency={'eur'} setCurrency={setCurrency} />
            <TopbarCurrency logo={'fab fa-btc'} styles={styles} selected={currency === 'btc'} currency={'btc'} setCurrency={setCurrency} />
            <TopbarCurrency logo={'fab fa-ethereum'} styles={styles} selected={currency === 'eth'} currency={'eth'} setCurrency={setCurrency} />
          </>
        )}
      </div>
      <h2 className={styles.middle}>
        {logo} <span>&nbsp;{title}</span>
      </h2>
      <div className={styles.right}>
        {isSubscribe && (
          <>
            <i className='fas fa-cog' onClick={() => setSettings(true)}></i>
            {settings && <TopbarSettings setSettings={setSettings} mail={mail} setMail={setMail} setBellActive={setBellActive} handleMail={handleMail} />}
            <i className='fas fa-bell' onClick={handleMail}></i>
            {/* span used for alert if user subscribed to mails */}
            <span style={bellActive ? { background: 'green' } : { background: 'rgba(224, 84, 84, 0.75)' }}></span>
          </>
        )}
        <i onClick={deconnexion} className='fas fa-power-off'></i>
      </div>
    </header>
  );
}
