import React, { useState, useEffect, useRef } from 'react';
import InputMessage from '../partial/Chat/InputMessage';
import MessageContainer from '../partial/Chat/MessageContainer';
import styles from './Community.module.css';
import Ws from '@adonisjs/websocket-client';
import useWindowSize from '../hooks/useWindowSize'

export default function Community() {
  const [chatReady, setChatReady] = useState(false);
  const [chat, setChat] = useState();
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState();
  const [firstDisplay, setFirstDisplay] = useState(false)
  const [messagesDisplayed, setMessagesDisplayed] = useState(false)
  const ws = useRef();
  const container = useRef();
  const windowSize = useWindowSize()

  //set the scroll of container to the bottom to see last message directly
  useEffect(() => {
    if(container.current.scrollTop > (windowSize.height > 450 ? container.current.scrollHeight - 1000 : container.current.scrollHeight - 500) || firstDisplay) {
      container.current.scroll({
        top: container.current.scrollHeight,
        left: 0,
        behavior: 'smooth',
      });
    }
    if(firstDisplay) setFirstDisplay(false)
    // eslint-disable-next-line
  }, [messages, firstDisplay, windowSize]);

  //connnect to a websocket server
  useEffect(() => {
    const token = localStorage.getItem('token');
    try {
      ws.current = Ws(`${process.env.REACT_APP_URL_BACK_WEBSOCKET}`, {path: 'chat'});
      ws.current.withJwtToken(token).connect();
      
      ws.current.on('open', () => {
        subscribeChat();
      });
    }
    catch(e) {
      console.log(e)
    }
    
    return () => {
      ws.current.close();
      if(chat) chat.off()
    };
    // eslint-disable-next-line
  }, []);
  
  function subscribeChat() {
    const chat = ws.current.subscribe('general');

    chat.on('ready', () => {
      setChatReady(true);
      setChat(chat);
    });

    chat.on('message', message => setMessage(message));
  }

  return (
    <div className={styles.container} ref={container}>
      <MessageContainer message={message} messages={messages} setMessages={setMessages} setFirstDisplay={setFirstDisplay} setMessagesDisplayed={setMessagesDisplayed} />
      <InputMessage chatReady={chatReady} chat={chat} messagesDisplayed={messagesDisplayed} />
    </div>
  );
}
