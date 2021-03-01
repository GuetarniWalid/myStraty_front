import { useContext } from 'react';
import useFetch from './useFetch';
import { useCallback } from 'react';
import { AlertContext } from '../partial/Providers';

export default function useGetRatesAndDataWallet() {
  const { setCard } = useContext(AlertContext);
  const execute = useFetch();

  const getRatesAndDataWallet = useCallback(async () => {
    //fire all fetch in same time to reduce pending time
    const [dataWallet, { price: BTCUSDTRate }, { price: ETHBTCRate }, { price: ETHUSDTRate }, { price: EURUSDTRate }] = await Promise.all([
      execute(`${process.env.REACT_APP_URL_BACK}/api/v1/assets/all/total`).catch(e => {
        throw new Error(e);
      }),
      fetch(`https://api.binance.com/api/v3/avgPrice?symbol=BTCUSDT`)
        .then(res => res.json())
        .catch(e => {
          throw new Error('binance');
        }),
      fetch(`https://api.binance.com/api/v3/avgPrice?symbol=ETHBTC`)
        .then(res => res.json())
        .catch(e => {
          throw new Error('binance');
        }),
      fetch(`https://api.binance.com/api/v3/avgPrice?symbol=ETHUSDT`)
        .then(res => res.json())
        .catch(e => {
          throw new Error('binance');
        }),
      fetch(`https://api.binance.com/api/v3/avgPrice?symbol=EURUSDT`)
        .then(res => res.json())
        .catch(e => {
          throw new Error('binance');
        }),
    ]).catch(error => {
      if (error.message === 'binance') {
        setCard({
          title: 'Une erreur est survenu',
          text: 'Nous sommes désolé mais les serveurs de Binance rencontrent actuellement un probleme, rafraichissez la page ou retentez ulterieurement',
          type: 'error',
          time: 6000,
        });
      } else console.log(error.message);
    });

    //after all Promise are resolve

    const rate = {
      BTCUSDT: BTCUSDTRate,
      ETHBTC: ETHBTCRate,
      ETHUSDT: ETHUSDTRate,
      EURUSDT: EURUSDTRate,
    };
    return { rate, dataWallet };
  }, [execute, setCard]);

  return getRatesAndDataWallet;
}
