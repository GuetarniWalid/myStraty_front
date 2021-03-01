import React, {useContext} from 'react';
import styles from './GraphicHeader.module.css';
import {DarkContext} from '../Providers'

export default function GraphicHeader({ selected, selectedGraph, title, type }) {
  const {darkMode} = useContext(DarkContext)

  const selectedStyle = {
    color: '#3276eb', 
    background: '#fff'
  }

  const selectedStyleDark = {
    color: '#7db7dc', 
    background: '#2e2e3d'
  }

  return (
    <>
      <h4 onClick={() => selectedGraph(type)} className={darkMode ? `${styles.h4} ${styles.dark}` : styles.h4} style={selected ? darkMode ? selectedStyleDark : selectedStyle : null}>
        {title}
      </h4>
    </>
  );
}
