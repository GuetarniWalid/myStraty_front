import React, {useContext} from 'react';
import styles from './StatusButton.module.css';
import {DarkContext} from '../partial/Providers'
import { useLocation } from 'react-router-dom';

export default function StatusButton({ children, status, handleFunction = null, idleStyle = null }) {
  const {darkMode} = useContext(DarkContext)
  const location = useLocation()
  
  let classNames = styles.button
  if(darkMode && location.pathname === '/') classNames += ` ${styles.dark} ${styles.login}`

  return (
    <>
      {status === 'idle' && <button onClick={handleFunction ? handleFunction : null} style={idleStyle ? idleStyle : null}  className={`${classNames} ${styles.idle}`}>{children}</button>}
      {status === 'pending' && (
        <button className={`${classNames} ${styles.pending}`} disabled>
          {children}
          <span>
            <i className='fas fa-circle'></i>
            <i className='fas fa-circle'></i>
            <i className='fas fa-circle'></i>
          </span>
        </button>
      )}
      {status === 'success' && <button onClick={handleFunction ? handleFunction : null} className={`${classNames} ${styles.success}`}>{children}</button>}
      {status === 'error' && <button onClick={handleFunction ? handleFunction : null} className={`${classNames} ${styles.error}`}>{children}</button>}
    </>
  );
}
