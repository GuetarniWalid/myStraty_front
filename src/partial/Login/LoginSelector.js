import React, {useContext} from 'react';
import styles from './LoginSelector.module.css';
import {DarkContext} from '../Providers'

export default function LoginSelector({ setForm, connexion, inscription, setStatus, setMessage, setResendMail }) {
  const {darkMode} = useContext(DarkContext)

  function handleConnexion() {
    setForm(connexion)
    setStatus('idle')
    setMessage()
    setResendMail(false)
  }

  function handleInscription() {
    setForm(inscription)
    setStatus('idle')
    setMessage()
    setResendMail(false)
  }

  return (
    <div className={darkMode ? `${styles.container} ${styles.dark}` : styles.container}>
      <div className={styles.wrapper}>
        <h2>Vous avez un compte ?</h2>
        <p>
          Les choses ont bien bougé depuis la dernière fois.
          <br />
          Si nous jetions un coup d'oeil !
        </p>
        <button onClick={handleConnexion}>Se connecter</button>
      </div>
      <div className={styles.wrapper}>
        <h2>Vous n'avez pas de compte ?</h2>
        <p>
          Créer un compte vous donnera accès a un essai gratuit de 1 mois ainsi qu'au tableau de bord.
        </p>
        <button onClick={handleInscription}>S'inscrire</button>
      </div>
    </div>
  );
}
