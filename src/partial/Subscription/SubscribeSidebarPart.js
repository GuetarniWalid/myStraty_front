import React, { useEffect, useState, useContext } from 'react';
import {PlanContext} from '../Providers'
import {TesterContext} from '../Providers'
import ToSubscribe from './ToSubscribeSidebar';
import useFetch from '../../hooks/useFetch';
import styles from './SubscribeSidebarPart.module.css';

export default function SubscribeSidebarPart() {
  const {setPlan} = useContext(PlanContext)
  const {setIsTester} = useContext(TesterContext)
  const [endDate, setEndDate] = useState();
  const execute = useFetch();

  //determine if user is tester or subscriber and dispaly data in relation to that
  useEffect(() => {
    let mounted = true;
    async function getSubscriptionInfo() {
      try {
        const data = await execute(`${process.env.REACT_APP_URL_BACK}/api/v1/subscription/info`);
        //to avoid states change if the component is unmonted
        if (!mounted) return;
        setEndDate(new Date(data.date_end_subscription));
        setIsTester(data.tester);
        //capitalize the first letter
        setPlan(data.type);
      } catch (e) {
        console.log(e.message);
      }
    }
    getSubscriptionInfo();

    //cleanup function
    return () => (mounted = false);

    // eslint-disable-next-line
  }, []);

  return (
    <div className={styles.container}>
      <ToSubscribe endDate={endDate}/>
    </div>
  );
}
