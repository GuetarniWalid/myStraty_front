import React, { useContext, useRef, useEffect } from 'react';
import { DarkContext } from '../Providers';
import styles from './ButtonToggleSideBar.module.css';
import logoWhite from '../../assets/img/logo-white.svg';
import { CoverContext } from '../Providers';
import Cover from '../../micro-partial/Cover';

export default function ButtonToggleSideBar({ setShowNav, showNav }) {
  const { darkMode } = useContext(DarkContext);
  const { setCoverAll, coverAll } = useContext(CoverContext);
  const ref = useRef();

  function toggleNav() {
    setShowNav(true);
    setCoverAll(true);
  }

  useEffect(() => {
    window.addEventListener('scroll', () => {
      ref.current.style.top = window.scrollY + 100 + 'px';
    });
  }, []);

  let containerClassNames = darkMode ? `${styles.container} ${styles.dark}` : styles.container;
  if (showNav) containerClassNames += ` ${styles.hide}`;
  else containerClassNames += ` ${styles.show}`;

  return (
    <>
      {coverAll && <Cover setShowNav={setShowNav} />}
      <div className={containerClassNames} ref={ref}>
        <img src={logoWhite} alt='logo' onClick={toggleNav} />
      </div>
    </>
  );
}
