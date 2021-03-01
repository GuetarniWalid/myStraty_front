import React, {useContext} from 'react';
import styles from './Slider.module.css';
import {DarkContext} from '../partial/Providers'

export default function Slider({max, value, handleChange}) {
  const {darkMode} = useContext(DarkContext)

  return (
    <div className={darkMode ? `${styles.slider} ${styles.dark}` : styles.slider} >
      <div className={styles.range} >
          <span>0</span>
          <span>$ {max}</span>
      </div>
      <input className={styles.selector} type='range' min='0' max={max} value={value} onChange={handleChange} />
    </div>
  );
}
