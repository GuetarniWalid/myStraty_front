import React, { useContext, useRef } from 'react';
import styles from './InputMessage.module.css';
import { UserContext } from '../Providers';
import {DarkContext} from '../Providers'

export default function InputMessage({ chatReady, chat, messagesDisplayed }) {
  const { user } = useContext(UserContext);
  const { darkMode } = useContext(DarkContext);
  const formRef = useRef();
  const textareaRef = useRef();

  function handleSubmit() {
    if (!chatReady) return;

    const userId = localStorage.getItem('userId');
    chat.emit('message', {
      userId: userId,
      pseudo: user.username,
      message: formRef.current.message.value,
    });
    formRef.current.reset();
    textareaRef.current.blur();
  }

  function handleKeyPress(e) {
    if (e.key === 'Enter') handleSubmit();
  }

  return (
    <form ref={formRef} className={darkMode ? `${styles.container} ${styles.dark}` : styles.container}>
      <textarea ref={textareaRef} onKeyPress={messagesDisplayed ? handleKeyPress : null} name='message' placeholder='Votre message...'></textarea>
      <div>
        {messagesDisplayed ? (
          <button onClick={handleSubmit} type='button' style={chatReady ? { color: '#85b1d1', cursor: 'pointer' } : { color: '#9cb0d4' }}>
            ENVOYÉ
          </button>
        ) : (
          <button style={chatReady ? { color: '#85b1d1', cursor: 'pointer' } : { color: '#9cb0d4' }} disabled>
            ENVOYÉ
          </button>
        )}
      </div>
    </form>
  );
}
