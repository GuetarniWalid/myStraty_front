import React, { useEffect, useRef, useState, useContext } from 'react';
import styles from './Input.module.css';
import {DarkContext} from '../partial/Providers'

export default function Input({ name, defaultValue, type, label, message }) {
  const {darkMode} = useContext(DarkContext) 
  const [focus, setFocus] = useState(false);
  const labelRef = useRef();
  const inputRef = useRef();

  useEffect(() => {
    if (inputRef.current.value.length || focus) {
      labelRef.current.style.top = '-8px';
      labelRef.current.style.transform = 'scale(0.7) translate(-20%, -50%)';
      labelRef.current.style.color = '#3276eb';
    } else {
      labelRef.current.style.top = '50%';
      labelRef.current.style.transform = 'scale(1) translateY(-50%)';
      labelRef.current.style.color = '#9cb0d4';
    }
  }, [defaultValue, focus, inputRef]);


  return (
    <div className={darkMode ? `${styles.container} ${styles.dark}` : styles.container}>
      <div >
        <label ref={labelRef} htmlFor={name}>
          {label}
        </label>
        <input id={name} ref={inputRef} defaultValue={defaultValue} name={name} type={type} onFocus={() => setFocus(true)} onBlur={() => setFocus(false)} autoComplete='on' />
        <span />
      </div>
      {message && <small>{message}</small>}
    </div>
  );
}
