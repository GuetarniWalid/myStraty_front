import React, { useRef, useEffect, useState, useContext } from 'react';
import Input from '../../micro-partial/Input';
import { createPortal } from 'react-dom';
import styles from './SidebarForm.module.css';
import DatePicker from 'react-date-picker';
import 'react-calendar/dist/Calendar.css';
import 'react-date-picker/dist/DatePicker.css';
import faceMen from '../../assets/img/faceMen.svg';
import faceWomen from '../../assets/img/faceWomen.svg';
import useLockBodyScroll from '../../hooks/useLockBodyScroll';
import useWindowSize from '../../hooks/useWindowSize';
import { AlertContext } from '../Providers';
import { UserContext } from '../Providers';
import {DarkContext} from '../Providers'
import useFetch from '../../hooks/useFetch';

export default function SidebarForm({ setToggleUser, setUserStatusInPercent }) {
  const { setCard } = useContext(AlertContext);
  const { user, setUser } = useContext(UserContext);
  const { darkMode } = useContext(DarkContext);
  const [selectedDate, handleDateChange] = useState(new Date(user.date_of_birth));
  const [errorMessage, setErrorMessage] = useState();
  const [errorField, setErrorField] = useState();
  const formRef = useRef();
  const parent = document.querySelector('.App');
  const windowSize = useWindowSize();
  const execute = useFetch();

  //to render page unscrollable, we use a hook
  useLockBodyScroll();

  useEffect(() => {
    const scrollY = window.scrollY;
    formRef.current.style.top = scrollY + 100 + 'px';
    //position recalculated on each change on window size
  }, [windowSize]);

  async function submitForm() {
    try {
      const response = await execute(`${process.env.REACT_APP_URL_BACK}/api/v1/user/update`, 'post', {
        username: formRef.current.username.value,
        email: formRef.current.email.value,
      });
      if (!response.success) {
        setErrorMessage(response.details.message);
        setErrorField(response.details.field);
        return;
      }
      setErrorField();
      setErrorMessage();
      setUser({
        ...user,
        username: formRef.current.username.value,
        email: formRef.current.email.value,
      });
      setToggleUser(false);
    } catch (e) {
      if (e.message === 'token expiry') console.log(e.message);
      else {
        setToggleUser(false);
        setCard({
          title: 'Une erreur est survenu',
          text: 'Nous sommes désolé mais nos serveurs rencontrent actuellement un problème, veuillez réessayer ultérieurement',
          type: 'error',
          time: 6000,
        });
      }
    }
  }

  async function changeDate(value) {
    handleDateChange(value);
    const date = new Date(value);
    const dateFormat = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

    try {
      const response = await execute(`${process.env.REACT_APP_URL_BACK}/api/v1/user/update`, 'post', {
        date_of_birth: dateFormat,
      });
      if (!response.success) {
        setCard({
          title: 'Une erreur est survenu',
          text: 'Nous sommes désolé mais nos serveur rencontre actuellement un probleme, veuillez réessayer ultérieurement',
          type: 'error',
          time: 6000,
        });
        return;
      }
      setUser(user => ({ ...user, date_of_birth: dateFormat }));
      setUserStatusInPercent(1);
    } catch (e) {
      if (e.message === 'token expiry') console.log(e.message);
      else {
        setCard({
          title: 'Une erreur est survenu',
          text: 'Nous sommes désolé mais nos serveur rencontre actuellement un probleme, veuillez réessayer ultérieurement',
          type: 'error',
          time: 6000,
        });
      }
    }
  }

  async function changeSex(male) {
    //if sex has not changed, no more treatment
    if (male === user.male) return;

    //we preserve old value in case of error, we reassign old value
    const userIsMale = user.male;
    setUser(user => ({ ...user, male: male }));

    //if the sex change, continue
    try {
      const response = await execute(`${process.env.REACT_APP_URL_BACK}/api/v1/user/update`, 'post', {
        male: !user.male,
      });
      if (!response.success) {
        setCard({
          title: 'Une erreur est survenu',
          text: 'Nous sommes désolé mais nos serveur rencontre actuellement un probleme, veuillez réessayer ultérieurement',
          type: 'error',
          time: 6000,
        });
        setUser(user => ({ ...user, male: userIsMale }));
      }
    } catch (e) {
      if (e.message === 'token expiry') console.log(e.message);
      else {
        setCard({
          title: 'Une erreur est survenu',
          text: 'Nous sommes désolé mais nos serveur rencontre actuellement un probleme, veuillez réessayer ultérieurement',
          type: 'error',
          time: 6000,
        });
        setUser(user => ({ ...user, male: userIsMale }));
      }
    }
  }

  return createPortal(
    <div className={darkMode ? `${styles.wrapper} ${styles.dark}` : styles.wrapper} onMouseDown={submitForm}>
      <form ref={formRef} onMouseDown={e => e.stopPropagation()}>
        <Input name='username' defaultValue={user.username} type='string' label='Pseudo' message={errorField === 'username' ? errorMessage : null} />
        <Input name='email' defaultValue={user.email} type='email' label='Email' message={errorField === 'email' ? errorMessage : null} />
        <div>
          Date de naissance: <DatePicker className={darkMode ? `${styles.calandarInput} ${styles.dark}` : styles.calandarInput} calendarClassName={darkMode ? `${styles.calandar} ${styles.dark}` :  styles.calandar} value={selectedDate} onChange={changeDate} clearIcon={null} format='dd/MM/yyyy' />
        </div>
        <div>
          <img src={faceMen} alt='visage en logo' onClick={() => changeSex(true)} className={user.male ? styles.sexSelected : null} />
          <img src={faceWomen} alt='visage en logo' onClick={() => changeSex(false)} className={!user.male ? styles.sexSelected : null} />
        </div>
      </form>
    </div>,
    parent
  );
}
