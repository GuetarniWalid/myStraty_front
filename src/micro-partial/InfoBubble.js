import React, { useContext } from 'react'
import styles from './InfoBubble.module.css'
import {createPortal} from 'react-dom'
import {DarkContext} from '../partial/Providers'

export default function InfoBubble({setInfo}) {
    const {darkMode} = useContext(DarkContext)
    const parent = document.querySelector('.App')


    return (
        createPortal(
        <div className={darkMode ? `${styles.container} ${styles.dark}` : styles.container} onClick={() => setInfo(false)} >
            <span>Les mails sont envoyé à heure fixe chaque jour selon l'heure spécifié et résume quelques informatons importantes</span>
        </div>
        , parent)
    )
}
