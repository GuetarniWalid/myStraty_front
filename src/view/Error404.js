import React, {useContext} from 'react'
import styles from './Error404.module.css'
import {DarkContext} from '../partial/Providers'

export default function Error404() {
    const {darkMode} = useContext(DarkContext)
    return (
        <div className={darkMode ? `${styles.container} ${styles.dark}` : styles.container} >
            <h1>404</h1>
            <p>Oups :(<br/>Cette page n'existe pas</p>
        </div>
    )
}
