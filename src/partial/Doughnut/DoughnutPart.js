import React, {useEffect, useRef, useContext} from 'react';
import styles from './Doughnut.module.css';
import {DarkContext} from '../Providers'

export default function DoughnutPart({ size, position, color, datas, rayon, strokeWidth, setCurrencySelected, currency, currencySelected, noStratActive }) {
  const ref = useRef()
  const {darkMode} = useContext(DarkContext)

  useEffect(() => {
    //set stroke-width only if there more than one currency
    if(size === 100) return
    //
    if(currency === currencySelected) {  
      if(ref.current) ref.current.setAttribute('stroke-width', strokeWidth * 1.4);    
    }
    else {
      if(ref.current) ref.current.setAttribute('stroke-width', strokeWidth)
    }
    // eslint-disable-next-line
  }, [currencySelected, currency])

  function doughnutSize() {
    //set size only if there more than one currency
    if(size === 100) return '100 0'
    //
    const fill = String(size - 0.3);
    const empty = String(100 - size + 0.3);
    return `${fill} ${empty}`;
  }

  function doughnutPosition() {
    let totalSizeOtherdoughut = 0;
    if (!position) return 25;
    else {
      datas.forEach((data, index) => {
        if (index < position) totalSizeOtherdoughut += data.value;
      });
    }
    return 100 - totalSizeOtherdoughut + 25;
  }


  return (
    <>
    {/* to prevent bugs, values to small are not represented */}
      {!(size <= 0.3) && (
        // if no strat active a plein dognhnut is displayed
        noStratActive ? 
        <circle
          className={styles.doughnutPart}
          cx='25'
          cy='25'
          r={rayon}
          fill='transparent'
          stroke={darkMode ? '#47475D' : '#E9F0FB'}
          strokeWidth='8'
        /> 
        : 
        <circle
          ref={ref}
          className={styles.doughnutPart}
          onMouseEnter={() => setCurrencySelected(currency)}
          cx='25'
          cy='25'
          r={rayon}
          fill='transparent'
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={doughnutSize()}
          strokeDashoffset={doughnutPosition()}
        />
      )}
    </>
  );
}
