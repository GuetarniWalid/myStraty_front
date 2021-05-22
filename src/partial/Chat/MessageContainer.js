import React, { useEffect, useRef, useContext, useState } from 'react';
import { Message } from './Message';
import styles from './MessageContainer.module.css';
import useFetch from '../../hooks/useFetch';
import { AlertContext } from '../Providers';
import { UserContext } from '../Providers';
import { formatRelative } from 'date-fns';
import { fr } from 'date-fns/locale';
import {MessageSeparator} from './MessageSeparator';
import { Prompt } from 'react-router';

export const MessageContainer = React.forwardRef(({ lastMessage, setMessages, messages, setMessagesDisplayed, messagesDisplayed, chat, messageIdToDelete }, containerMessagesRef) => {
  const { user, setUser } = useContext(UserContext);
  const { setCard } = useContext(AlertContext);
  const ref = useRef();
  const isMessageAddedRef = useRef(false);
  const [messageSelectedId, setMessageSelectedId] = useState();
  const [lastMessageRead, setLastMessageRead] = useState();
  const execute = useFetch();

  //load messages from backend database
  useEffect(() => {
    async function getMessages() {
      try {
        const messages = await execute(`${process.env.REACT_APP_URL_BACK}/api/v1/chat/all/messages`);
        setMessages(messages);
        setMessagesDisplayed(true);
      } catch (e) {
        console.log(e.message);
        if (e.message === 'token expiry') return;
        if (e.message === 'subscription expiry') return;
        if (e.message === 'request blocked: bad user') return;
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
    if (lastMessage) {
      setMessages([...messages, lastMessage]);
      isMessageAddedRef.current = true;
    }

    // eslint-disable-next-line
  }, [lastMessage]);

  //update messages to drop delete message
  useEffect(() => {
    if (messageIdToDelete) {
      const messagesFiltered = messages.filter(message => message.id !== messageIdToDelete);
      setMessages(messagesFiltered);
    }
    // eslint-disable-next-line
  }, [messageIdToDelete]);

  //get the last message id read by the user, executed only once when page load
  useEffect(() => {
    setLastMessageRead(user.last_message_read);
  }, [user]);


  let indexLastMessageRead = 0;
  let indexLastMessageReadAttributed = false;
  const discussion = messages.map((message, index) => {
    //to calculate the index of the last message read by the user
    if (!indexLastMessageReadAttributed && message.id > user.last_message_read) {
      indexLastMessageRead = index;
      indexLastMessageReadAttributed = true;
    }

    const date = formatRelative(new Date(message.created_at), new Date(Date.now()), {
      locale: fr,
    });
    return (
      <Message
        key={message.id}
        text={message.message}
        userId={message.user_id}
        pseudo={message.pseudo}
        date={date}
        id={message.id}
        chat={chat}
        setMessageSelectedId={setMessageSelectedId}
        messageSelectedId={messageSelectedId}
        lastMessageRead={lastMessageRead}
        setLastMessageRead={setLastMessageRead}
        messages={messages}
        isBeforeLastMessage={index === messages.length - 3}
        ref={containerMessagesRef}
      />
    );
  });

  if(messagesDisplayed) {
    let isSeparatorToTheEnd = false;
    //in case all message are read
    if (user.last_message_read && !indexLastMessageRead) { 
      indexLastMessageRead = messages.length;
      isSeparatorToTheEnd = true;
    }
    discussion.splice(indexLastMessageRead, 0, <MessageSeparator key={'separator'} messagesDisplayed={messagesDisplayed} lastMessage={isSeparatorToTheEnd} ref={containerMessagesRef} />);
  }

  return (
    <>
      <div ref={ref} className={styles.container}>
        {discussion}
      </div>
      <Prompt
        message={() => {
          setUser(user => ({ ...user, last_message_read: lastMessageRead }));
        }}
      />
    </>
  );
});
