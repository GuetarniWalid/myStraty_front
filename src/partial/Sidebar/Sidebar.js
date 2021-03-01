import React, { useState, useEffect, useContext } from 'react';
import SidebarForm from './SidebarForm';
import SubscribePart from '../Subscription/SubscribeSidebarPart';
import styles from './Sidebar.module.css';
import logo from '../../assets/img/logo.svg';
import logoDark from '../../assets/img/logoDark.svg';
import faceMen from '../../assets/img/faceMen.svg';
import faceWomen from '../../assets/img/faceWomen.svg';
import { Link, useLocation, useRouteMatch } from 'react-router-dom';
import { RefreshStrategyContext } from '../Providers';
import { SubscribeContext } from '../Providers';
import { UserContext } from '../Providers';
import { DarkContext } from '../Providers';
import { CoverContext } from '../Providers';
import useFetch from '../../hooks/useFetch';
import ButtonToggleSideBar from './ButtonToggleSideBar';

//Circumference of circle for rayon=36
const circumference = 2 * Math.PI * 36;

export default function Sidebar() {
  const { refresh } = useContext(RefreshStrategyContext);
  const { isSubscribe } = useContext(SubscribeContext);
  const { setUser, user } = useContext(UserContext);
  const { darkMode } = useContext(DarkContext);
  const { setCoverAll, coverAll } = useContext(CoverContext);
  const { url } = useRouteMatch();
  const [userStatusInPercent, setUserStatusInPercent] = useState(0.8);
  const [toggleUser, setToggleUser] = useState(false);
  const [tradingActive, setTradingActive] = useState(false);
  const [showNav, setShowNav] = useState(false)
  const [dataUserLoaded, setDataUserLoaded] = useState(false)
  const location = useLocation();
  const execute = useFetch();

  //get user's data
  useEffect(() => {
    let mounted = true;
    async function getUser() {
      try {
        const json = await execute(`${process.env.REACT_APP_URL_BACK}/api/v1/user`);
        //to avoid states change if the component is unmonted
        if (!mounted) return;

        setUser(json);
        setDataUserLoaded(true)

        //determine how many percent the user's status is filled
        //in total, 5 info needed (mail, password, sex, age, username)
        //since mail, password, sex and username are required, only age can be empty
        if (!json.date_of_birth) setUserStatusInPercent(0.8);
        else setUserStatusInPercent(1);
      } catch (e) {
        console.log(e.message);
      }
    }
    getUser();

    return () => (mounted = false);
    // eslint-disable-next-line
  }, [execute]);

  //toggle navbar if screen width < 700px
  useEffect(() => {
    if ((window.screen.width < 700) & !coverAll) {
      setShowNav(false)
      setCoverAll(false);
    }
    //close div with user inputs
    setToggleUser(false);
    // eslint-disable-next-line
  }, [coverAll]);

  //set color div to show if one strategy is active or not
  useEffect(() => {
    let mounted = true;
    async function isOneStratActive() {
      try {
        const json = await execute(`${process.env.REACT_APP_URL_BACK}/api/v1/strategies/user/active`);
        //to avoid states change if the component is unmonted
        if (!mounted) return;

        setTradingActive(json.isActive);
      } catch (e) {
        console.log(e.message);
      }
    }
    isOneStratActive();

    return () => (mounted = false);
  }, [refresh, execute]);


  let navClasses = darkMode ? `${styles.nav} ${styles.dark}` : styles.nav;
  if(showNav) navClasses += ` ${styles.show}`
  else navClasses += ` ${styles.hide}`
  return (
    <>
      <ButtonToggleSideBar setShowNav={setShowNav} showNav={showNav} setCoverAll={setCoverAll} />
      <nav className={navClasses}>
        {/* header */}
        <div className={styles.wrapper}>
          <div className={darkMode ? `${styles.containerLogo} ${styles.dark}` : `${styles.containerLogo} ${styles.light}`}>
            <img src={darkMode ? logoDark : logo} alt='logo' className={styles.logo} />
            <h1 className={styles.h1}>MyStraty</h1>
          </div>
          <div>
            {/* section photo */}
            <div className={styles.faceWrapper}>
              <svg className={styles.svg}>
                <defs>
                  {/* eslint-disable-next-line */}
                  {user.male == true ? (
                    <linearGradient id='gradient' x1='0' y1='0' x2='0.5' y2='0.7'>
                      <stop offset='0%' stopColor={darkMode ? '#0689da' : '#1C3EE0'} />
                      <stop offset='100%' stopColor={darkMode ? '#7DB7DC' : '#04B3F8'} />
                    </linearGradient>
                  ) : (
                    <linearGradient id='gradient' x1='0' y1='0' x2='0.5' y2='0.7'>
                      <stop offset='0%' stopColor='#E99DCA' />
                      <stop offset='100%' stopColor='#FCD4EC' />
                    </linearGradient>
                  )}
                </defs>
                <circle
                  cx='50'
                  cy='50'
                  r='36'
                  className={styles.circle}
                  transform='rotate(-90,50,50)'
                  stroke='url(#gradient)'
                  //strokeDashoffset change according user status percentage
                  strokeDashoffset={circumference * (1 - userStatusInPercent)}
                ></circle>
              </svg>
              <img src={user.male ? faceMen : faceWomen} alt='visage en logo' className={styles.face} />
              <button className={darkMode ? `${styles.toggle} ${styles.dark}` : styles.toggle} onClick={dataUserLoaded ? () => setToggleUser(true) : null}>
                {/* eslint-disable-next-line */}
                <i className='fas fa-sort-down' style={user.male == true ? null : { color: '#DA9CC1' }}></i>
              </button>
              {toggleUser && <SidebarForm setToggleUser={setToggleUser} setUserStatusInPercent={setUserStatusInPercent} />}
              {tradingActive ? (
                <p className={`${styles.tradingActive} ${styles.botStatus}`}>
                  <i className='fas fa-check-circle'></i> &nbsp;Trading activé
                </p>
              ) : (
                <p className={darkMode ? `${styles.tradingInActiveDark} ${styles.botStatus}` : `${styles.tradingInActive} ${styles.botStatus}`}>Trading non activé</p>
              )}
            </div>
            {/* section Link */}
            {isSubscribe && (
              <ul className={darkMode ? `${styles.ul} ${styles.dark}` : styles.ul}>
                <li className={location.pathname === `${url}/dashboard` ? styles.liSelected : null}>
                  <Link to={`${url}/dashboard`} className={styles.link}>
                    <i className='fas fa-th-large'></i> &nbsp;Dashboard
                  </Link>
                </li>
                <li className={location.pathname === `${url}/strategie` ? styles.liSelected : null}>
                  <Link to={`${url}/strategie`} className={styles.link}>
                    <i className='fas fa-chart-line'></i> &nbsp;Strategie
                  </Link>
                </li>
                <li className={location.pathname === `${url}/historique` ? styles.liSelected : null}>
                  <Link to={`${url}/historique`} className={styles.link}>
                    <i className='fas fa-history'></i> &nbsp;Historique
                  </Link>
                </li>
                <li className={location.pathname === `${url}/communaute` ? styles.liSelected : null}>
                  <Link to={`${url}/communaute`} className={styles.link}>
                    <i className='fas fa-comment'></i> &nbsp;Communauté
                  </Link>
                </li>
              </ul>
            )}
          </div>
          <SubscribePart />
        </div>
      </nav>
    </>
  );
}
