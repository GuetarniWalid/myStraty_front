import React, { useEffect, useRef, useContext } from 'react';
import Message from './Message';
import styles from './MessageContainer.module.css';
import useFetch from '../../hooks/useFetch';
import { AlertContext } from '../Providers';
import { formatRelative } from 'date-fns'
import { fr } from 'date-fns/locale'

export default function MessageContainer({ message, setMessages, messages, setFirstDisplay, setMessagesDisplayed}) {
  const { setCard } = useContext(AlertContext);
  const ref = useRef();

  const execute = useFetch();

  //load messages from backend database
  useEffect(() => {
    async function getMessages() {
      try {
        const messages = await execute(`${process.env.REACT_APP_URL_BACK}/api/v1/chat/all/messages`);
        setMessages(messages);
        setFirstDisplay(true)
        setMessagesDisplayed(true)
      } catch (e) {
        console.log(e.message);
        if(e.message === 'token expiry') return
        if(e.message === 'subscription expiry') return
        if(e.message === 'request blocked: bad user') return
        setCard({
          title: 'Erreur de connexion',
          text: 'Nous sommes désolé mais nos serveurs rencontre un problème momentané, réessayez plus tard ou veuillez nous prevenir de ce problème.',
          type: 'error',
          time: 6000,
        });
      }
    }
    getMessages();
    // eslint-disable-next-line
  }, []);

  //add new message from websocket server
  useEffect(() => {
    if (message) {
      setMessages([
        ...messages,
        {
          user_id: message.user_id,
          pseudo: message.pseudo,
          message: message.message,
          created_at: message.created_at,
        },
      ]);
    }

    // eslint-disable-next-line
  }, [message]);

  const discussion = messages.map((message, index) => {
    const date = formatRelative(new Date(message.created_at), new Date(Date.now()), {
      locale: fr
    })
    return <Message key={index} text={message.message} userId={message.user_id} pseudo={message.pseudo} date={date} />;
  });

  return (
    <div ref={ref} className={styles.container}>
      {discussion}
    </div>
  );
}
