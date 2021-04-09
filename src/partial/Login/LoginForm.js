import React, { useState, useContext, useRef } from 'react';
import { Redirect } from 'react-router-dom';
import Input from '../../micro-partial/Input';
import StatusButton from '../../micro-partial/StatusButton';
import styles from './LoginForm.module.css';
import { AlertContext } from '../Providers';
import { LoggedInContext } from '../Providers';
import { DarkContext } from '../Providers';

export default function LoginForm({ form, status, setStatus, setForm, forget, displayPasswordInput, token, message, setMessage, resendMail, setResendMail }) {
  const { setCard } = useContext(AlertContext);
  const { setLoggedIn } = useContext(LoggedInContext);
  const { darkMode } = useContext(DarkContext);
  const [field, setField] = useState();
  const [logged, setLogged] = useState(false);
  const div = useRef();

  async function handleSubmit(e, type) {
    e.preventDefault();
    setMessage();
    setStatus('pending');
    try {
      //in case the user has forgotten his password we add a token in the header
      const headers = token
        ? {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          }
        : {
            'Content-Type': 'application/json',
          };
      const data = await fetch(`${process.env.REACT_APP_URL_BACK}/api/v1/login/${type}`, {
        method: 'post',
        headers: headers,
        body: JSON.stringify({
          email: e.target.email.value,
          password: e.target.password ? e.target.password.value : null,
          username: e.target.username ? e.target.username.value : null,
          updatePassword: displayPasswordInput ? true : false,
        }),
      });
      const json = await data.json();
      if (json.success && form.type === 'inscription') {
        e.target.reset();
        setStatus('success');
        setCard({
          title: 'Un email a été envoyé !',
          text: "Il peut arrivé que le mail mette quelque temps à arriver, cela est independant de notre volonté. Merci de cliquer sur le lien présent à l'interieur afin de finaliser votre inscription. ",
          type: 'success',
          time: '10000',
        });
      } else if (!json.success && form.type === 'inscription') {
        setMessage(json.details.message);
        setField(json.details.field);
        setStatus('error');
        //if user already exist we propose te resend a mail
        if (json.details.validation === 'unique') {
          setResendMail(true);
        }
      } else if (json.success && form.type === 'connexion') {
        localStorage.setItem('token', json.token);
        localStorage.setItem('userId', json.userId);
        setLoggedIn(true);
        setLogged(true);
      } else if (!json.success && form.type === 'connexion') {
        if(json.message === "user not active") {
          setStatus('error');
          setCard({
            title: 'Validez votre email',
            text: "Votre email n'a pas encore été validé, veuillez cliquer sur le lien qui vous a été envoyé. Il peut arrivé que le mail prenne quelque temps à arriver.",
            type: 'error',
            time: '10000',
          });
        } else {
          setField(json.details.field);
          setMessage(json.details.field === 'email' ? 'Email incorrect' : 'Mot de passe incorrect');
          setStatus('error');
        }
      } else if (json.success && form.type === 'forget' && !displayPasswordInput) {
        e.target.reset();
        setStatus('success');
        setCard({
          title: 'Bien recu!',
          text: "Un email a été envoyé a votre adresse. Merci de cliquer sur le lien présent à l'interieur afin de réinitialiser votre mot de passe.",
          type: 'success',
          time: '10000',
        });
      } else if (json.success && form.type === 'forget' && displayPasswordInput) {
        setLogged(true);
      } else {
        setField(json.details.field);
        setMessage(json.details.message);
        setStatus('error');
      }
    } catch (e) {
      setStatus('error');
      setCard({
        title: 'Une erreur est survenue',
        text: 'Cette erreur est liée à nos serveur, si celle-ci persiste retentez de vous connecter ulterieurement ou contactez nous par mail',
        type: 'error',
        time: '10000',
      });
    }
  }

  async function handleForgottenPassword(e) {
    e.preventDefault();
    setForm(forget);
  }

  async function handleResendMail(e) {
    e.preventDefault()
    const mail = document.getElementById('email').value;
    const data = await fetch(`${process.env.REACT_APP_URL_BACK}/api/v1/login/resend/mail`, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: mail,
      }),
    });
    const json = await data.json();
    if (json.success) {
      setCard({
        title: 'Email envoyé!',
        text: 'Un nouveau mail a été envoyé à votre adresse',
        type: 'success',
        time: '10000',
      });
    } else {
      setCard({
        title: 'Email incorrect',
        text: 'Veuillez entrer un mail correct pour recevoir un nouveau mail',
        type: 'error',
        time: '10000',
      });
    }
  }

  return (
    <>
      {logged && <Redirect to='/console/dashboard' />}
      <div
        ref={div}
        className={
          form.type === 'connexion'
            ? darkMode
              ? `${styles.container} ${styles.bounceLeft} ${styles.dark}`
              : `${styles.container} ${styles.bounceLeft}`
            : darkMode
            ? `${styles.container} ${styles.bounceRight} ${styles.dark}`
            : `${styles.container} ${styles.bounceRight}`
        }
      >
        <div>
          <h1 className={form.type === 'connexion' ? styles.sliceLeft : styles.sliceRight}>{form.title}</h1>
          <form onSubmit={e => handleSubmit(e, form.type)} className={form.type === 'connexion' ? styles.sliceLeft : styles.sliceRight}>
            {form.type === 'inscription' && <Input name='username' type='text' label='Pseudo' message={field === 'username' && message} />}
            <Input name='email' type='email' label='Email' message={field === 'email' && message} />
            {!(form.type === 'forget') && <Input name='password' type='password' label='Mot de passe' message={field === 'password' && message} />}
            {form.type === 'forget' && displayPasswordInput && <Input name='password' type='password' label='Nouveau mot de passe' message={field === 'password' && message} />}
            <StatusButton status={status}>{form.button}</StatusButton>
          </form>
          {form.type === 'connexion' && (
            <button type='button' onClick={handleForgottenPassword} className={styles.sliceLeft + ' ' + styles.forget}>
              Mot de passe oublié
            </button>
          )}
          {form.type === 'inscription' && resendMail && (
            <button type='button' onClick={handleResendMail} className={styles.sliceLeft + ' ' + styles.forget + ' ' + styles.resend}>
              Renvoyer le mail
            </button>
          )}
        </div>
      </div>
    </>
  );
}
