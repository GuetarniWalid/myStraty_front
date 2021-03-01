import React, { useContext } from 'react'
import { createPortal } from 'react-dom';
import {CoverContext} from '../partial/Providers'
import styles from './Cover.module.css'

export default function Cover({setShowNav}) {
    const {setCoverAll} = useContext(CoverContext)
    const app = document.querySelector('.App')   

    function hideNav() {
        setShowNav(false)
        setCoverAll(false)
    }

    return createPortal(
        <div className={styles.cover} onClick={hideNav}></div>,
        app
      );
}
