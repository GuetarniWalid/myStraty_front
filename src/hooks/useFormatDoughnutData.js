import { useCallback, useContext } from 'react';
import useGetRatesAndDataWallet from './useGetRatesAndDataWallet';
import { DarkContext } from '../partial/Providers';

export default function useFormatDoughnutData() {
  const { darkMode } = useContext(DarkContext);
  const getRatesAndDataWallet = useGetRatesAndDataWallet();

  const formatDoughnutData = useCallback(async () => {
    const { rate, dataWallet } = await getRatesAndDataWallet();

    //the values ​​of each currency for each strategy
    const dataStrategies = dataWallet.map(dataStategy => {
      return {
        strategy: dataStategy.title,
        active: dataStategy.active,
        btc: {
          name: 'Bitcoin',
          value: {
            btc: dataStategy.btc,
            eth: dataStategy.btc / rate.ETHBTC,
            eur: (dataStategy.btc * rate.BTCUSDT) / rate.EURUSDT,
          },
          color: 'rgba(255,146,1,1)',
          sign: '฿',
        },
        eth: {
          name: 'Ethereum',
          value: {
            btc: dataStategy.eth * rate.ETHBTC,
            eth: dataStategy.eth,
            eur: (dataStategy.eth * rate.ETHUSDT) / rate.EURUSDT,
          },
          color: darkMode ? '#5A5A5A' : 'rgba(57,57,57,1)',
          sign: 'Ξ',
        },
        eur: {
          //for Euro, data is converted directly from usdt with rate.EURUSDT
          name: 'Euro',
          value: {
            btc: dataStategy.usdt / rate.BTCUSDT / rate.EURUSDT,
            eth: dataStategy.usdt / rate.ETHUSDT / rate.EURUSDT,
            eur: dataStategy.usdt / rate.EURUSDT,
          },
          color: 'rgba(123,158,113,1)',
          sign: '€',
        },
      };
    });

    //the values ​​of each currency are combined to form the total per currency
    const formatDataAllStrategies = {};
    dataWallet.forEach(data => {
      if (!formatDataAllStrategies.btc) {
        formatDataAllStrategies.btc = {
          name: 'Bitcoin',
          value: {
            btc: data.btc,
            eth: data.btc / rate.ETHBTC,
            eur: (data.btc * rate.BTCUSDT) / rate.EURUSDT,
          },
          color: 'rgba(255,146,1,1)',
          sign: '฿',
        };
      } else {
        formatDataAllStrategies.btc.value.btc += data.btc;
        formatDataAllStrategies.btc.value.eth += data.btc / rate.ETHBTC;
        formatDataAllStrategies.btc.value.eur += (data.btc * rate.BTCUSDT) / rate.EURUSDT;
      }
      if (!formatDataAllStrategies.eth) {
        formatDataAllStrategies.eth = {
          name: 'Ethereum',
          value: {
            btc: data.eth * rate.ETHBTC,
            eth: data.eth,
            eur: (data.eth * rate.ETHUSDT) / rate.EURUSDT,
          },
          color: darkMode ? '#5A5A5A' : 'rgba(57,57,57,1)',
          sign: 'Ξ',
        };
      } else {
        formatDataAllStrategies.eth.value.btc += data.eth * rate.ETHBTC;
        formatDataAllStrategies.eth.value.eth += data.eth;
        formatDataAllStrategies.eth.value.eur += (data.eth * rate.ETHUSDT) / rate.EURUSDT;
      }
      if (!formatDataAllStrategies.eur) {
        formatDataAllStrategies.eur = {
          //for Euro, data is converted directly from usdt with rate.EURUSDT
          name: 'Euro',
          value: {
            btc: data.usdt / rate.BTCUSDT / rate.EURUSDT,
            eth: data.usdt / rate.ETHUSDT / rate.EURUSDT,
            eur: data.usdt / rate.EURUSDT,
          },
          color: 'rgba(123,158,113,1)',
          sign: '€',
        };
      } else {
        formatDataAllStrategies.eur.value.btc += data.usdt / rate.BTCUSDT / rate.EURUSDT;
        formatDataAllStrategies.eur.value.eth += data.usdt / rate.ETHUSDT / rate.EURUSDT;
        formatDataAllStrategies.eur.value.eur += data.usdt / rate.EURUSDT;
      }
    });

    return {
      allStrategiesFormated: formatDataAllStrategies,
      arrayOfEachStrategy: dataStrategies,
      rate,
    };
    // eslint-disable-next-line
  }, []);

  return formatDoughnutData;
}
