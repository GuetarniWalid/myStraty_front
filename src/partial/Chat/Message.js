import React, { useEffect, useState, useContext } from 'react';
import { formatFirstLetterUppercase } from '../../functions/various';
import styles from './Message.module.css';
import {DarkContext} from '../Providers'
import { UserContext } from '../Providers';

export default function Message({ text, userId, pseudo, date }) {
  console.log("🚀 ~ file: Message.js ~ line 7 ~ Message ~ userId", userId)
  const { user } = useContext(UserContext);
  const {darkMode} = useContext(DarkContext)
  const [ownMessage, setOwnMessage] = useState();
  const adminMessage = Number(userId) === 1;

  useEffect(() => {
    setOwnMessage(Number(user.id) === Number(userId));
  }, [userId, user.id]);

  return (
    <div className={darkMode ? `${styles.container} ${styles.dark}` : styles.container}>
      <div style={ownMessage ? null : { justifyContent: 'flex-end' }}>
        <span
          className={styles.dot}
          style={ownMessage ? { marginRight: '7px', background: adminMessage ? '#9D79BC' : '#75a861' } : { marginLeft: '8px', background: adminMessage ? 'purple' : '#85b1d1', order: 2 }}
        ></span>
        <span style={ownMessage ? null : { order: 1 }}>{ownMessage ? 'Vous' : formatFirstLetterUppercase(pseudo)}</span>
        <span>{date}</span>
      </div>
      {adminMessage ? <p className={ownMessage ? `${styles.left} ${styles.admin}` : `${styles.right} ${styles.admin}`}>{text}</p> : <p className={ownMessage ? styles.left : styles.right}>{text}</p>}
    </div>
  );
}
