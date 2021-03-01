import React, { useEffect, useState, useRef, useContext } from 'react';
import { createPortal } from 'react-dom';
import styles from './TopbarSettings.module.css';
import DateTimePicker from 'react-time-picker';
import InfoBubble from '../../micro-partial/InfoBubble';
import useLockBodyScroll from '../../hooks/useLockBodyScroll';
import useWindowSize from '../../hooks/useWindowSize';
import useFetch from '../../hooks/useFetch';
import { DarkContext } from '../Providers';

export default function TopbarSettings({ setSettings, mail, setMail, handleMail }) {
  const { setDarkMode, darkMode } = useContext(DarkContext);
  const parent = document.querySelector('.App');
  const [time, setTime] = useState('09:00');
  const [info, setInfo] = useState(false);
  const windowSize = useWindowSize();
  const formRef = useRef();
  const execute = useFetch();

  //to render page unscrollable, we use a hook
  useLockBodyScroll();

  useEffect(() => {
    const scrollY = window.scrollY;
    formRef.current.style.top = scrollY + 100 + 'px';
    //position recalculated on each change on window size
  }, [windowSize]);

  //get settings from database
  useEffect(() => {
    async function getSettings() {
      try {
        const settings = await execute(`${process.env.REACT_APP_URL_BACK}/api/v1/settings`);
        setMail(settings.send_mail ? true : false);
        //determine the offset with UTC converted in minutes and hours
        const date = new Date();
        const offset = date.getTimezoneOffset();
        const offsetInMinute = offset % 60;
        const offsetInHour = parseInt(offset / 60);
        const timeInArray = settings.mail_time.split(':');
        let hours = Number(timeInArray[0]);
        let minutes = Number(timeInArray[1]);
        //
        //format time in local
        let minuteLocal = minutes - offsetInMinute;
        let hoursLocal = (hours - offsetInHour) % 24;
        if (hoursLocal < 0) hoursLocal = 24 - hoursLocal;
        minuteLocal = String(minuteLocal).padStart(2, '0');
        hoursLocal = String(hoursLocal).padStart(2, '0');
        const timeInUTC = [hoursLocal, minuteLocal, '00'].join(':');
        //
        setTime(timeInUTC);
      } catch (e) {
        console.log(e.message);
      }
    }
    getSettings();
    // eslint-disable-next-line
  }, []);

  function handleDarkMode(e) {
    e.preventDefault();
    if (darkMode) localStorage.setItem('darkMode', false);
    else localStorage.setItem('darkMode', true);
    setDarkMode(state => !state);
  }

  function handleClockTime() {
    //determine the offset with UTC converted in minutes and hours
    const date = new Date();
    const offset = date.getTimezoneOffset();
    const offsetInMinute = offset % 60;
    const offsetInHour = parseInt(offset / 60);
    //
    //rounds the user's time to the nearest quarter of an hour
    const timeInArray = time.split(':');
    let minutes = Number(timeInArray[1]);
    let hours = Number(timeInArray[0]);
    if (minutes < 8) minutes = 0;
    else if (minutes < 23) minutes = 15;
    else if (minutes < 38) minutes = 30;
    else if (minutes < 53) minutes = 45;
    else {
      minutes = 0;
      hours += 1;
    }
    //
    //format time in UTC
    let minutesUTC = minutes + offsetInMinute;
    let hoursUTC = (hours + offsetInHour) % 24;
    if (hoursUTC < 0) hoursUTC = 24 + hoursUTC;
    minutesUTC = String(minutesUTC).padStart(2, '0');
    hoursUTC = String(hoursUTC).padStart(2, '0');
    const timeInUTC = [hoursUTC, minutesUTC, '00'].join(':');
    //
    //format time in local
    minutes = String(minutes).padStart(2, '0');
    hours = String(hours).padStart(2, '0');
    const newTime = [hours, minutes, '00'].join(':');
    setTime(newTime);
    //
    try {
      execute(`${process.env.REACT_APP_URL_BACK}/api/v1/settings`, 'post', { mailTime: timeInUTC });
    } catch (e) {
      console.log(e.message);
    }
  }

  return createPortal(
    <div className={darkMode ? `${styles.wrapper} ${styles.dark}` : styles.wrapper} onClick={() => setSettings(false)}>
      <form ref={formRef} onClick={e => e.stopPropagation()}>
        <div className={styles.containerDarkMode}>
          <button className={styles.toggleBtn} onClick={handleDarkMode} style={darkMode ? { background: '#7db7dc' } : { background: '#bdc1c8' }}>
            <span style={darkMode ? { right: '3px' } : { right: '32px' }} className={styles.switch} />
          </button>
          <span className={styles.text}>{darkMode ? 'Mode nuit' : 'Mode jour'}</span>
        </div>
        <div className={styles.containerDarkMode}>
          <button className={styles.toggleBtn} onClick={handleMail} style={mail ? { background: '#7db7dc' } : { background: '#bdc1c8' }}>
            <span style={mail ? { right: '3px' } : { right: '32px' }} className={styles.switch} />
          </button>
          <span className={styles.text}>{mail ? 'Envois de mail activé' : 'Envois de mail désactivé'}</span>
        </div>
        {mail && (
          <div className={styles.clock}>
            <>
              <span>
                Heure du mail&nbsp;&nbsp;&nbsp;<i onClick={() => setInfo(true)} className='fas fa-info-circle'></i>
              </span>
              <br />
              <br />
            </>
            {info && <InfoBubble setInfo={setInfo} />}
            {mail && 
            <DateTimePicker 
              onChange={setTime} 
              value={time} format={'HH:mm'} 
              name='time' 
              onClockClose={handleClockTime} 
              clockClassName={styles.watch} 
              className={styles.clockHour} 
              disableClock={true}
            />}
          </div>
        )}
      </form>
    </div>,
    parent
  );
}
