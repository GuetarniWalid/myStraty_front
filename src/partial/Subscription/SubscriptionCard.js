import React, { useContext, useState } from 'react';
import styles from './SubscriptionCard.module.css';
import useFetch from '../../hooks/useFetch';
import { AlertContext } from '../Providers';
import {PlanContext} from '../Providers'
import {SubscribeContext} from '../Providers'
import {TesterContext} from '../Providers'
import StatusButton from '../../micro-partial/StatusButton';

export default function SubscriptionCard({ primaryColor, secondaryColor, price, title, walletSize, priceId }) {
  const execute = useFetch();
  const { setCard } = useContext(AlertContext);
  const {plan} = useContext(PlanContext);
  const {isSubscribe} = useContext(SubscribeContext);
  const {isTester} = useContext(TesterContext);
  const isPlan = plan === title.toLowerCase();
  const [status, setStatus] = useState('idle')

  async function openStripeSession() {
    setStatus('pending')
    try {
      const stripe = window.Stripe(process.env.REACT_APP_STRIPE_KEY)
      const { sessionId } = await execute(`${process.env.REACT_APP_URL_BACK}/api/v1/subscription/create-checkout-session`, 'post', { priceId });
      return stripe.redirectToCheckout({ sessionId });
    } catch (e) {
      setStatus('error')
      if (e.message === 'stripe') {
        setCard({
          title: "Une erreur s'est produite.",
          text: 'Les serveurs de paiement rencontre actuellement un problème, nous vous invitons a réessayer ultérieurement',
          type: 'error',
          time: '6000',
        });
      } else console.log(e.message);
    }
  }

  async function goCustomerPortal() {
    setStatus('pending')
    try {
      const {urlToRedirect} = await execute(`${process.env.REACT_APP_URL_BACK}/api/v1/subscription/customer-portal`);
      window.location.href = urlToRedirect
    }
    catch(e) {
      setStatus('error')
      console.log(e)
    }
  }

  return (
    <div className={styles.container} style={isSubscribe && !isTester && isPlan ? {transform: 'scale(1.1)', boxShadow: '0px 10px 30px 0px rgba(83, 99, 134, 0.2)'} : null} >
      <div style={{ background: primaryColor }}>
        <h3>{title}</h3>
        <p>
          <span>{price}</span> €
        </p>
        <p>par mois</p>
      </div>
      <div style={{ background: secondaryColor }}>
        <StatusButton handleFunction={isSubscribe && !isTester ? goCustomerPortal : openStripeSession} status={status} idleStyle={{ background: primaryColor, color: '#fff' }}>
          {isSubscribe && !isTester ? isPlan ? "Gérer" : "Changer" : "S'abonner"}
        </StatusButton>
        <h4 style={{ color: primaryColor }}>Taille maximal du portefeuille sous gestion</h4>
        <p style={{ color: primaryColor }}>{walletSize} $</p>
      </div>
    </div>
  );
}
