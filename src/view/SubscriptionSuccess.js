import React, { useEffect, useState, useContext } from 'react';
import StatusButton from '../micro-partial/StatusButton'
import styles from './SubscriptionSuccess.module.css';
import confetti from 'canvas-confetti';
import useFetch from '../hooks/useFetch';
import {DarkContext} from '../partial/Providers'

export default function SubscriptionSuccess() {
  const {darkMode} = useContext(DarkContext)
  const execute = useFetch();
  const [status, setStatus] = useState('idle');

  useEffect(() => {
    const count = 200;
    const defaults = {
      origin: { y: 0.7 },
    };

    function fire(particleRatio, opts) {
      confetti(
        Object.assign({}, defaults, opts, {
          particleCount: Math.floor(count * particleRatio),
        })
      );
    }

    fire(0.25, {
      spread: 26,
      startVelocity: 55,
    });
    fire(0.2, {
      spread: 60,
    });
    fire(0.35, {
      spread: 100,
      decay: 0.91,
      scalar: 0.8,
    });
    fire(0.1, {
      spread: 120,
      startVelocity: 25,
      decay: 0.92,
      scalar: 1.2,
    });
    fire(0.1, {
      spread: 120,
      startVelocity: 45,
    });

    return () => confetti.reset();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus('pending')
    try {
      const {urlToRedirect} = await execute(`${process.env.REACT_APP_URL_BACK}/api/v1/subscription/customer-portal`);
      setStatus('success')
      window.location.href = urlToRedirect
    }
    catch(e) {
      setStatus('error')
      console.log(e)
    }
  }

  return (
    <div className={darkMode ? `${styles.container} ${styles.dark}` : styles.container}>
      <h1>Félicitation</h1>
      <p>Votre abonnement a bien été pris en compte.</p>
      <p>
        Pour toute demande, n'hésitez pas à nous envoyer un mail ou en faire part dans l'espace communauté.
        <br />
        Nous avons vocation à rester un petit groupe donc profitez-en, cela nous permet de rester réactif
        <br />
        Nous espérons gagner ensemble, et n'oubliez pas que nous utilisons directement nos stratégies donc nous voilà maintenant lié pour une belle aventure.
      </p>
      <form onSubmit={handleSubmit} >
        <StatusButton status={status}>Gérer votre abonnement</StatusButton>
      </form>
    </div>
  );
}
