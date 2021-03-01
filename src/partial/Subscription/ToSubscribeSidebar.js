import React, { useContext } from 'react';
import styles from './ToSubscribeSidebar.module.css';
import { formatDistanceStrict, differenceInDays, isBefore, addDays } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Link, useLocation } from 'react-router-dom';
import { SubscribeContext } from '../Providers';
import { PlanContext } from '../Providers';
import { TesterContext } from '../Providers';
import {DarkContext} from '../Providers'

export default function ToSubscribeSidebar({ endDate = Date.now() }) {
  const { isSubscribe } = useContext(SubscribeContext);
  const { plan } = useContext(PlanContext);
  const { isTester } = useContext(TesterContext);
  const { darkMode } = useContext(DarkContext);
  
  //determine the remainings days of free test
  //as we leave 3 days after the end of the subscription for regulated
  const subscriptionDatePassed = isBefore(endDate, Date.now());
  const remainingDays = subscriptionDatePassed ? formatDistanceStrict(Date.now(), addDays(endDate, 3), { locale: fr}) : formatDistanceStrict(Date.now(), endDate, { locale: fr});
  const { pathname } = useLocation();

  //determine the value of progress bar
  const remainingDaysInNumber = differenceInDays(endDate, Date.now());

  let className;
  if (isTester) className = styles.tester + ' ' + styles.container;
  else if (!isSubscribe || subscriptionDatePassed) className = styles.expiry + ' ' + styles.container;
  else {
    switch (plan) {
      case 'or':
        className = styles.gold + ' ' + styles.container;
        break;
      case 'argent':
        className = styles.silver + ' ' + styles.container;
        break;
      case 'bronze':
        className = styles.bronze + ' ' + styles.container;
        break;
      default:
        className = styles.tester + ' ' + styles.container;
    }
  }

  return (
    <>
      <div className={darkMode ? `${className} ${styles.dark}` : className}>
        {!isSubscribe ? (
          <p>
            <span>Abonnement expiré</span>
          </p>
        ) : subscriptionDatePassed ? (
          <p>Abonnement expiré</p>
        ) : isTester ? (
          <p>
            Il reste <span>{remainingDays}</span> d'essais
          </p>
        ) : (
          <p>
            Plan <span>{plan && plan.charAt(0).toUpperCase() + plan.slice(1)}</span>
          </p>
        )}
        {!isTester && isSubscribe && (
          <p>
            {subscriptionDatePassed ? 'Coupure dans' : 'Il vous reste'} <span>{remainingDays}</span>
          </p>
        )}
        {isSubscribe && !subscriptionDatePassed && <progress max='30' value={remainingDaysInNumber} />}
      </div>
      {pathname !== '/console/abonnement' && <Link to='/console/abonnement'>{isTester ? "S'abonner" : 'Voir mon plan'}</Link>}
    </>
  );
}
