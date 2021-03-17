import { useCallback, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { LoggedInContext } from '../partial/Providers';
import { SubscribeContext } from '../partial/Providers';

/**
 * @description A Hook that return a handle function for requests
 * @function useFetch
 * @returns {execute} - Return a function that handle request with authorization header
 */
export default function useFetch() {
  const { setLoggedIn, loggedIn } = useContext(LoggedInContext);
  const { setIsSubscribe } = useContext(SubscribeContext);
  const token = localStorage.getItem('token');
  const history = useHistory();

  /**
   * @description Add permission headers to the request and redirect user if there is bad authentication, the subscription or token validity is expiry
   * @async
   * @function execute
   * @param {string} url - The url to request
   * @param {string} [method=get] - The request method
   * @param {object} [body=null] - The request body
   * @returns {*} Return the result parsed from the API
   */
  const execute = useCallback(async (url, method = 'get', body = null) => {
    try {
      let data;
      //in case method is GET
      if (method === 'get') {
        data = await fetch(`${url}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }

      //in case method is POST
      if (method === 'post') {
        data = await fetch(`${url}`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(body),
        });
      }

      const json = await data.json();
      if (json.success === false) {
        switch (json.details.type) {
          //if JWT is expiry, redirect to login page
          case 'expiry':
            setLoggedIn(false);
            throw new Error(json.details.message);
          //if user's subscription is expiry, he is redirect to '/console/abonnement'
          case 'subscription':
            if (loggedIn) history.replace('/console/abonnement');
            setIsSubscribe(false);
            throw new Error(json.details.message);
          //if bad authentication, redirect to login page
          case 'auth':
            setLoggedIn(false);
            throw new Error(json.details.message);
          //if there is an error on a form
          case 'formValidation':
            return json;
          default:
            throw new Error(json.details.type);
        }
      } else {
        return json;
      }
    } catch (e) {
      throw new Error(e.message);
    }
    // eslint-disable-next-line
  }, []);

  return execute;
}
