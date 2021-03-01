import React, {useContext} from 'react';
import styles from './QuestionResponse.module.css';
import {DarkContext} from '../partial/Providers'

export default function QuestionResponse({ children, question, setQuestionSelected, num, show }) {
  const {darkMode} = useContext(DarkContext)


  return (
    <li className={darkMode ? `${styles.li} ${styles.dark}` : styles.li} >
      <p style={!show ? {cursor: 'pointer'} : null} onClick={() => setQuestionSelected(num)}>{question} &nbsp;{!show && <i className="fas fa-chevron-down"></i>}</p>
      <p className={show ? styles.response + ' ' + styles.show : styles.response} onClick={() => setQuestionSelected()}>
      <i className="fas fa-chevron-up"></i>
        {children}
      </p>
    </li>
  );
}
