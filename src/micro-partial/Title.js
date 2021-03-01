import React, {useContext} from 'react'
import styles from './Title.module.css'
import {DarkContext} from '../partial/Providers'

export default function Title({children}) {
    const {darkMode} = useContext(DarkContext)

    return (
        <div>
            <h3 className={styles.h3} style={darkMode ? {color: '#f3f1ff'} : null}>{children}</h3>
        </div>
    )
}
