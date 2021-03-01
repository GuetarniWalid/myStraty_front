import './App.css';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';
import Providers from './partial/Providers';
import Login from './view/Login';
import Console from './view/Console';
import Error404 from './view/Error404';

function App() {
  return (
    <div className='App'>
      <Router>
        <Providers>
          <Switch>
            <Route path='/console'>
              <Console/>
            </Route>
            <Route exact path='/'>
              <Login />
            </Route>
            <Route path='/'>
              <Error404 />
            </Route>
          </Switch>
        </Providers>
      </Router>
    </div>
  );
}

export default App;
