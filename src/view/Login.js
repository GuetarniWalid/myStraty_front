import React, { useState, useEffect, useContext } from 'react';
import LoginForm from '../partial/Login/LoginForm';
import LoginSelector from '../partial/Login/LoginSelector';
import styles from './Login.module.css';
import { AlertContext } from '../partial/Providers';
import { DarkContext } from '../partial/Providers';

const connexion = {
  title: 'CONNECTION',
  type: 'connexion',
  button: 'SE CONNECTER',
};

const inscription = {
  title: 'INSCRIPTION',
  type: 'inscription',
  button: "S'INSCRIRE",
};

const forget = {
  title: 'MOT DE PASSE OUBLIÉ',
  type: 'forget',
  button: 'ENVOYER',
};

export default function Login() {
  const { setCard } = useContext(AlertContext);
  const { darkMode } = useContext(DarkContext);
  const [form, setForm] = useState(connexion);
  const [status, setStatus] = useState('idle');
  const [displayPasswordInput, setDisplayPasswordInput] = useState(false);
  const [token, setToken] = useState();
  const [message, setMessage] = useState();
  const [resendMail, setResendMail] = useState(false);

  useEffect(() => {
    //if we come from registration process we display a message card
    const url_string = window.location.href;
    const paramsString = url_string.split('?')[1];
    if (paramsString) {
      const paramsInArray = paramsString.split('&');
      const params = {};
      paramsInArray.forEach(parameter => {
        const paramSplitted = parameter.split('=');
        params[paramSplitted[0]] = paramSplitted[1];
      });
      if (params.validation === 'true' && params.forget === 'true') {
        //fix bug due to back redirection that add '#/' to the end or url
        let token = params.token.split('#')[0]
        setToken(token);
        setForm(forget);
        setDisplayPasswordInput(true);
        setCard({
          title: 'Dernière étape!',
          text: 'Entrez votre mail, ainsi que votre nouveau mot de passe et le tour est joué!',
          type: 'success',
          time: '10000',
        });
      } else if (params.validation === 'false' && params.forget === 'true') {
        setForm(forget);
        setCard({
          title: "Une erreur s'est produite",
          text: "Votre mail n'a pu être identifié, veuillez recommencer le processus de recuperationde mot de passe depuis le debut.",
          type: 'error',
          time: '10000',
        });
      } else if (params.validation === 'true') {
        setCard({
          title: 'Inscription réussi !',
          text: 'Vous voilà maintenant inscript! Bienvenue parmis nous! Vous pouvez maintenant vous connecter.',
          type: 'success',
          time: '10000',
        });
      }
    }
    // eslint-disable-next-line
  }, []);

  //set the body background
  useEffect(() => {
    if (darkMode) {
      document.body.style.background = `linear-gradient(216deg, rgba(77, 77, 77,0.05) 0%, rgba(77, 77, 77,0.05) 25%,rgba(42, 42, 42,0.05) 25%, rgba(42, 42, 42,0.05) 38%,rgba(223, 223, 223,0.05) 38%, rgba(223, 223, 223,0.05) 75%,rgba(36, 36, 36,0.05) 75%, rgba(36, 36, 36,0.05) 100%),linear-gradient(44deg, rgba(128, 128, 128,0.05) 0%, rgba(128, 128, 128,0.05) 34%,rgba(212, 212, 212,0.05) 34%, rgba(212, 212, 212,0.05) 57%,rgba(25, 25, 25,0.05) 57%, rgba(25, 25, 25,0.05) 89%,rgba(135, 135, 135,0.05) 89%, rgba(135, 135, 135,0.05) 100%),linear-gradient(241deg, rgba(55, 55, 55,0.05) 0%, rgba(55, 55, 55,0.05) 14%,rgba(209, 209, 209,0.05) 14%, rgba(209, 209, 209,0.05) 60%,rgba(245, 245, 245,0.05) 60%, rgba(245, 245, 245,0.05) 69%,rgba(164, 164, 164,0.05) 69%, rgba(164, 164, 164,0.05) 100%),linear-gradient(249deg, rgba(248, 248, 248,0.05) 0%, rgba(248, 248, 248,0.05) 32%,rgba(148, 148, 148,0.05) 32%, rgba(148, 148, 148,0.05) 35%,rgba(202, 202, 202,0.05) 35%, rgba(202, 202, 202,0.05) 51%,rgba(181, 181, 181,0.05) 51%, rgba(181, 181, 181,0.05) 100%),linear-gradient(92deg, rgb(46,46,61),rgb(46,46,61))`;
    } else {
      document.body.style.background = `linear-gradient(
        216deg,
        rgba(77, 77, 77, 0.05) 0%,
        rgba(77, 77, 77, 0.05) 25%,
        rgba(42, 42, 42, 0.05) 25%,
        rgba(42, 42, 42, 0.05) 38%,
        rgba(223, 223, 223, 0.05) 38%,
        rgba(223, 223, 223, 0.05) 75%,
        rgba(36, 36, 36, 0.05) 75%,
        rgba(36, 36, 36, 0.05) 100%
      ),
      linear-gradient(
        44deg,
        rgba(128, 128, 128, 0.05) 0%,
        rgba(128, 128, 128, 0.05) 34%,
        rgba(212, 212, 212, 0.05) 34%,
        rgba(212, 212, 212, 0.05) 57%,
        rgba(25, 25, 25, 0.05) 57%,
        rgba(25, 25, 25, 0.05) 89%,
        rgba(135, 135, 135, 0.05) 89%,
        rgba(135, 135, 135, 0.05) 100%
      ),
      linear-gradient(
        241deg,
        rgba(55, 55, 55, 0.05) 0%,
        rgba(55, 55, 55, 0.05) 14%,
        rgba(209, 209, 209, 0.05) 14%,
        rgba(209, 209, 209, 0.05) 60%,
        rgba(245, 245, 245, 0.05) 60%,
        rgba(245, 245, 245, 0.05) 69%,
        rgba(164, 164, 164, 0.05) 69%,
        rgba(164, 164, 164, 0.05) 100%
      ),
      linear-gradient(
        249deg,
        rgba(248, 248, 248, 0.05) 0%,
        rgba(248, 248, 248, 0.05) 32%,
        rgba(148, 148, 148, 0.05) 32%,
        rgba(148, 148, 148, 0.05) 35%,
        rgba(202, 202, 202, 0.05) 35%,
        rgba(202, 202, 202, 0.05) 51%,
        rgba(181, 181, 181, 0.05) 51%,
        rgba(181, 181, 181, 0.05) 100%
      ),
      linear-gradient(92deg, rgb(223, 239, 255), rgb(223, 239, 255))`;
    }
  }, [darkMode]);

  return (
    <div className={styles.container}>
      <LoginSelector setForm={setForm} connexion={connexion} inscription={inscription} setStatus={setStatus} setMessage={setMessage} setResendMail={setResendMail} />
      <LoginForm
        form={form}
        status={status}
        setStatus={setStatus}
        setForm={setForm}
        forget={forget}
        displayPasswordInput={displayPasswordInput}
        token={token}
        message={message}
        setMessage={setMessage}
        resendMail={resendMail}
        setResendMail={setResendMail}
      />
    </div>
  );
}
