import React, { useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import styles from './AlertCard.module.css';

export default function AlertCard({ title, text, type, setMount, time }) {
    const body = document.body;
    const ref = useRef();
    
    const unmount = useCallback(() => {
      const scrollY = window.scrollY;
      ref.current.style.top = scrollY + 0 + 'px';
      ref.current.style.opacity = 0;
      setTimeout(() => setMount(), 400);
      // eslint-disable-next-line
    }, [])

  useEffect(() => {
    const scrollY = window.scrollY;
    ref.current.style.top = scrollY + 100 + 'px';
    ref.current.style.opacity = 1;

    const timer = setTimeout(() => unmount(), time);
    return () => clearTimeout(timer);
    // eslint-disable-next-line
  }, []);


  return createPortal(
    <div ref={ref} className={type === 'success' ? `${styles.success} ${styles.container}` : type === 'warning' ? `${styles.warning} ${styles.container}` : `${styles.error} ${styles.container}`}>
      <h4>{title}</h4>
      <p>{text}</p>
      <i className='fas fa-times' onClick={unmount}></i>
    </div>,
    body
  );
}
