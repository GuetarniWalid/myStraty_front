import React, { useEffect, useContext } from 'react';
import { Route, Switch, useHistory, useRouteMatch } from 'react-router-dom';
import Sidebar from '../partial/Sidebar/Sidebar';
import Topbar from '../partial/Topbar/Topbar';
import Dashboard from './Dashboard';
import Strategy from './Strategy';
import History from './History';
import { LoggedInContext } from '../partial//Providers';
import Subscription from './Subscription';
import SubscriptionSuccess from './SubscriptionSuccess';
import Community from './Community';
import { DarkContext } from '../partial/Providers';
import Error404 from './Error404';

export default function Console() {
  const { path } = useRouteMatch();
  const { darkMode } = useContext(DarkContext);
  const { loggedIn } = useContext(LoggedInContext);
  const history = useHistory();

  //to trigger the user redirection in case is not logged, we redifined logged state(even if is already false)
  useEffect(() => {
    if (!loggedIn) history.replace('/');
  });

  //set the body background color
  useEffect(() => {
    if (darkMode) document.body.style.background = 'linear-gradient(234deg, rgba(54,54,73,1) 0%, rgba(77,77,101,1) 100%)';
    else document.body.style.background = '#F3F7FD';
  }, [darkMode]);

  return (
    <>
      <Sidebar />
      <div className='right'>
        <Topbar />

        <Switch>
          <Route exact path={`${path}/dashboard`}>
            <Dashboard />
          </Route>
          <Route exact path={`${path}/strategie`}>
            <Strategy />
          </Route>
          <Route exact path={`${path}/historique`}>
            <History />
          </Route>
          <Route exact path={`${path}/communaute`}>
            <Community />
          </Route>
          <Route exact path={`${path}/abonnement`}>
            <Subscription />
          </Route>
          <Route exact path={`${path}/abonnement/succes`}>
            <SubscriptionSuccess />
          </Route>
          <Route path={`${path}`}>
            <Error404 />
          </Route>
        </Switch>
      </div>
    </>
  );
}
