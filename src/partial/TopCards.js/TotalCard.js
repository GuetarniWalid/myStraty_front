import React, { useRef, useContext } from 'react';
import styles from './TotalCard.module.css';
import {DarkContext} from '../Providers'

export default function TotalCard({value, text, handleClick, up}) {
  const {darkMode} = useContext(DarkContext)
  const ref = useRef()


  return (
    <div className={darkMode ? `${styles.container} ${styles.dark}` : styles.container} onClick={handleClick} >
      <svg id='Capa_1' enableBackground='new 0 0 512 512' height='30' viewBox='0 0 512 512' width='25' xmlns='http://www.w3.org/2000/svg'>
        <defs>
          <linearGradient id='gradientGraphUp' x1='0' y1='0' x2='0' y2='1'>
            <stop ref={ref} offset='0%' stopColor='#B2FFEF' />
            <stop offset='100%' stopColor='#fff' />
          </linearGradient>
          <linearGradient id='gradientGraphDown' x1='0' y1='0' x2='0' y2='1'>
            <stop ref={ref} offset='0%' stopColor='#FFBCBC' />
            <stop offset='100%' stopColor='#fff' />
          </linearGradient>
        </defs>
        <g fill='url(#gradient)'>
          <path d='m409.6 115.143h-102.4l-51.2 57.564-75 182.324h258.6l72.4-193.677v-161.354z' fill={up ? '#10B992' : '#FF6B6B'} />
          <path d='m204.8 230.271h-102.4l-102.4 115.143v83.293h256v-256z' fill={up ? '#10B992' : '#FF6B6B'} />
          <path d='m307.2 250.471-51.2 44.56-60 108.484 60 108.485h256v-350.646l-102.4 89.117z' fill={up ? 'url(#gradientGraphUp)' : 'url(#gradientGraphDown)'} />
          <path d='m204.8 339.589h-102.4l-102.4 89.118v83.293h256v-216.969z' fill={up ? 'url(#gradientGraphUp)' : 'url(#gradientGraphDown)'} />
        </g>
      </svg>
      <span>
        {value} &nbsp;<i className={up ? 'fas fa-caret-up' : 'fas fa-caret-down'} style={up ? { color: '#10B992' } : { color: '#FF6B6B'}}></i>
        <br />
        <small>{text}</small>
      </span>
    </div>
  );
}
