import React, { useState, useEffect, useRef } from 'react';
import InputMessage from '../partial/Chat/InputMessage';
import {MessageContainer} from '../partial/Chat/MessageContainer';
import styles from './Community.module.css';
import Ws from '@adonisjs/websocket-client';

export default function Community() {
  const [chatReady, setChatReady] = useState(false);
  const [chat, setChat] = useState();
  const [messages, setMessages] = useState([]);
  const [messageIdToDelete, setMessageIdToDelete] = useState();
  const [message, setMessage] = useState();
  const [messagesDisplayed, setMessagesDisplayed] = useState(false);
  const ws = useRef();
  const containerMessagesRef = useRef();

  //connnect to a websocket server
  useEffect(() => {
    const token = localStorage.getItem('token');
    try {
      ws.current = Ws(`${process.env.REACT_APP_URL_BACK_WEBSOCKET}`, { path: 'chat' });
      ws.current.withJwtToken(token).connect();

      ws.current.on('open', () => {
        subscribeChat();
      });
    } catch (e) {
      console.log(e);
    }

    return () => {
      ws.current.close();
      if (chat) chat.off();
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
    chat.on('delete', messageId => setMessageIdToDelete(messageId));
  }

  return (
    <div className={styles.container} ref={containerMessagesRef}>
      <MessageContainer
        lastMessage={message}
        messageIdToDelete={messageIdToDelete}
        messages={messages}
        setMessages={setMessages}
        setMessagesDisplayed={setMessagesDisplayed}
        messagesDisplayed={messagesDisplayed}
        chat={chat}
        ref={containerMessagesRef}
      />
      <InputMessage chatReady={chatReady} chat={chat} messagesDisplayed={messagesDisplayed} />
    </div>
  );
}
