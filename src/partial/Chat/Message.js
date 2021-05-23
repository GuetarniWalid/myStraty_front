import React, { useEffect, useState, useContext, useRef } from 'react';
import { formatFirstLetterUppercase } from '../../functions/various';
import styles from './Message.module.css';
import { DarkContext } from '../Providers';
import { UserContext } from '../Providers';
import { NumberUnreadMessagesContext } from '../Providers';
import MessageBubble from './MessageBubble';
import useOnScreen from '../../hooks/useOnScreen';

export const Message = React.forwardRef(
  ({ text, userId, pseudo, date, id, chat, setMessageSelectedId, messageSelectedId, setLastMessageRead, lastMessageRead, messages, isBeforeLastMessage }, containerMessagesRef) => {
    const ref = useRef();
    const { user } = useContext(UserContext);
    const { darkMode } = useContext(DarkContext);
    const { setNumberUnreadMessage } = useContext(NumberUnreadMessagesContext);
    const [ownMessage, setOwnMessage] = useState();
    const [showBubble, setShowBubble] = useState(false);
    const adminMessage = Number(userId) === 1;
    const onScreen = useOnScreen(ref, '0px', containerMessagesRef.current);

    useEffect(() => {
      setOwnMessage(Number(user.id) === Number(userId));
    }, [userId, user.id]);

    //hide message bubble if another message is selected
    useEffect(() => {
      if (messageSelectedId !== id && showBubble) {
        setShowBubble(false);
      }
      // eslint-disable-next-line
    }, [messageSelectedId]);

    //if message appear in the screen, update database to notif that user already read this message
    useEffect(() => {
      if (id > lastMessageRead && onScreen && chat) {
        setLastMessageRead(id);
        chat.emit('message', { id, userId, action: 'read' });

        //calculate the number of messages unread
        const messagesUnread = messages.filter(message => message.id > id);
        setNumberUnreadMessage(messagesUnread.length);
      }
      // eslint-disable-next-line
    }, [onScreen, chat]);

    //when a new message is posted, page scroll down if before last message is on screen
    useEffect(() => {
      if (isBeforeLastMessage && onScreen) {
        containerMessagesRef?.current.scroll({
          top: ref.current.offsetTop,
          left: 0,
          behavior: 'smooth',
        });
      }
      // eslint-disable-next-line
    }, [ref, messages, onScreen]);

    function handleClick() {
      if (Number(user.id) === Number(userId)) {
        setMessageSelectedId(id);
        setShowBubble(true);
      }
    }

    let classes;
    if (adminMessage) {
      classes = ownMessage ? `${styles.left} ${styles.admin}` : `${styles.right} ${styles.admin}`;
    } else {
      classes = ownMessage ? styles.left : styles.right;
    }

    return (
      <div className={darkMode ? `${styles.container} ${styles.dark}` : styles.container} ref={ref}>
        <div style={ownMessage ? null : { justifyContent: 'flex-end' }}>
          <span
            className={styles.dot}
            style={ownMessage ? { marginRight: '7px', background: adminMessage ? '#9D79BC' : '#75a861' } : { marginLeft: '8px', background: adminMessage ? '#9D79BC' : '#85b1d1', order: 2 }}
          ></span>
          <span style={ownMessage ? null : { order: 1 }}>{ownMessage ? 'Vous' : formatFirstLetterUppercase(pseudo)}</span>
          <span>{date}</span>
        </div>
        <p className={classes} onClick={handleClick}>
          {text}
          {showBubble && <MessageBubble messageId={id} chat={chat} setShowBubble={setShowBubble} side={ownMessage ? 'left' : 'right'} />}
        </p>
      </div>
    );
  }
);
