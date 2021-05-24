import React, { useContext, useEffect, useRef, useState } from 'react';
import { DarkContext } from '../Providers';
import styles from './MessageSeparator.module.css';

export const MessageSeparator = React.forwardRef(({lastMessage}, containerMessagesRef) => {
  const { darkMode } = useContext(DarkContext);
  const ref = useRef()
  const lastMessageRef = useRef(lastMessage)
  const [firstRender, setFirstRender] = useState(false)


//scroll down in fisrt render to see unread messages
useEffect(() => {
  if(!firstRender) {
    containerMessagesRef?.current.scroll({
      top: ref.current.offsetTop - 80,
      left: 0,
      behavior: 'smooth',
    });
    setFirstRender(true)
  }
}, [containerMessagesRef, firstRender]);

  return (
    <p className={darkMode ? `${styles.p} ${styles.dark}` : styles.p} ref={ref} style={{padding: lastMessageRef.current ? '0px 0px' : '6px 0'}} >
      {!lastMessageRef.current && <span>Messages non lus &nbsp;</span>}
      {!lastMessageRef.current && <i className='fas fa-chevron-down'></i>}
    </p>
  );
})
