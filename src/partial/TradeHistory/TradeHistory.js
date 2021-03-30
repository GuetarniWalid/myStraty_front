import React, { useEffect, useState, useRef, useContext } from 'react';
import Title from '../../micro-partial/Title';
import styles from './TradeHistory.module.css';
import { formatCurrency, formatDate, formatDateDistanceToNowStrict, filterTradeBuy, filterTradeSell, filterCurrencyETH, filterCurrencyBTC, convert } from '../../functions/various';
import { currencyFormat } from '../../general/settings';
import { RateContext } from '../Providers';
import { CurrencyContext } from '../Providers';
import { Link, useLocation } from 'react-router-dom';
import useFetch from '../../hooks/useFetch';
import {DarkContext} from '../Providers'

export default function TradeHistory({ limit }) {
  const {darkMode} = useContext(DarkContext)
  const { rate } = useContext(RateContext);
  const { currency: currencyContext } = useContext(CurrencyContext);
  const [trades, setTrades] = useState([]);
  const [formatDateToNow, setformatDateToNow] = useState(false);
  const [action, setAction] = useState('all');
  const [currency, setCurrency] = useState('various');
  const [convertIn, setConvertIn] = useState(currencyContext);
  const tradeRef = useRef();
  const { pathname } = useLocation();
  const execute = useFetch();

  useEffect(() => {
    let mounted = true
    async function getTradeHistory() {
      try {
        const json = await execute(`${process.env.REACT_APP_URL_BACK}/api/v1/trade/all`);
        //to avoid states change if the component is unmonted
        if (!mounted) return;

        tradeRef.current = limit ? json.slice(0, limit) : json;
        setTrades(tradeRef.current);
      } catch (e) {
        console.log(e.message);
      }
    }
    getTradeHistory();

    //cleanup function
    return () => mounted = false
    
    // eslint-disable-next-line
  }, [limit]);

  function handleActionClick() {
    if (action === 'all') {
      const tradeFilter = filterTradeBuy(tradeRef.current);
      setTrades(tradeFilter);
      setAction('buy');
    } else if (action === 'buy') {
      const tradeFilter = filterTradeSell(tradeRef.current);
      setTrades(tradeFilter);
      setAction('sell');
    } else {
      setTrades(tradeRef.current);
      setAction('all');
    }
  }

  function handleCurrencyClick() {
    console.log(currency);
    if (currency === 'various') {
      const currencyFiltered = filterCurrencyBTC(tradeRef.current);
      setTrades(currencyFiltered);
      setCurrency('btc');
    } else if (currency === 'btc') {
      const currencyFiltered = filterCurrencyETH(tradeRef.current);
      setTrades(currencyFiltered);
      setCurrency('eth');
    } else {
      setTrades(tradeRef.current);
      setCurrency('various');
    }
  }

  function convertClick() {
    if (convertIn === 'eur') setConvertIn('btc');
    else if (convertIn === 'btc') setConvertIn('eth');
    else setConvertIn('eur');
  }

  const tradeList = trades.map(trade => {
    const baseCurrency = trade.pair.substring(0, 3).toLowerCase();
    const amountFormated = formatCurrency(trade.amount, baseCurrency);
    const pairFormated = currencyFormat[trade.pair];
    const date = formatDateToNow ? formatDate(trade.created_at, 'dd/LL à HH:mm') : formatDateDistanceToNowStrict(trade.created_at);

    //if "converIn" is in eur, we first convert to usdt then convert to euro because all pair aren't convertible directly in euro
    let valueConverted = convertIn === 'eur' ? convert(trade.amount, trade.pair, 'usdt', rate) / rate.EURUSDT : convert(trade.amount, trade.pair, convertIn, rate);
    let valueConvertedFormated = formatCurrency(valueConverted, convertIn);
    const sign = currencyFormat[convertIn].sign;

    //In case "rate" is not yet loaded
    if (!Object.keys(rate).length) valueConvertedFormated = 0;
    //
    return (
      <tr key={trade.id}>
        <td className={styles.date}>{date}</td>
        <td className={styles.blue}>{trade.exchange}</td>
        <td className={`${styles.blue} ${styles.pair}`}>{pairFormated}</td>
        <td className={styles.blue}>
          <span className={styles.action} style={trade.action === 'BUY' ? { background: '#0FD6AB' } : { background: '#E84855' }}>
            {trade.action}
          </span>
        </td>
        <td className={`${styles.blue} ${styles.bold}`}>
          <span style={trade.action === 'BUY' ? { color: '#0FD6AB' } : { color: '#E84855' }}>{trade.action === 'BUY' ? '+' : '-'} </span>
          {amountFormated}
        </td>
        <td className={styles.blue}>{currencyFormat[baseCurrency].shortName}</td>
        <td className={styles.blue}>
          {sign} {valueConvertedFormated}
        </td>
      </tr>
    );
  });

  return (
    <div className={pathname === '/console/historique' ? styles.container : styles.containerInDashboard}>
      <div className={styles.titleContainer}>
        <Title>Historique de trade</Title>
        {!(pathname === '/console/historique') && (
          <Link className={darkMode ? `${styles.link} ${styles.dark}` : styles.link} to='historique'>
            Voir tout <i className='fas fa-caret-right'></i>
          </Link>
        )}
      </div>
      <div className={darkMode ? `${styles.containerTrade} ${styles.dark}` : styles.containerTrade}>
        <table>
          <thead>
            <tr>
              <td className={styles.selectable} onClick={() => setformatDateToNow(state => !state)}>
                Date <i className='fas fa-chevron-down'></i>
              </td>
              <td>Platform</td>
              <td>Pair</td>
              <td className={styles.selectable} onClick={handleActionClick}>
                Action <i className='fas fa-chevron-down'></i>
              </td>
              <td>Montant</td>
              <td onClick={pathname === '/console/historique' ? handleCurrencyClick : null} className={styles.selectable}>
                Devise {pathname === '/console/historique' ? <i className='fas fa-chevron-down'></i> : null}
              </td>
              <td className={styles.selectable} onClick={convertClick}>
                En {convertIn === 'usdt' ? 'eur' : convertIn} <i className='fas fa-chevron-down'></i>
              </td>
            </tr>
          </thead>
          <tbody>
            {tradeList.length ? (
              tradeList
            ) : (
              <tr>
                <td colSpan='7' className={styles.noTrade}>
                  Aucun trade n'a encore été fait.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
