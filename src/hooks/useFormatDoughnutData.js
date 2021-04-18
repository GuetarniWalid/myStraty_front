import { useCallback, useContext } from 'react';
import useGetRatesAndDataWallet from './useGetRatesAndDataWallet';
import { DarkContext } from '../partial/Providers';
import Big from 'big.js'

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
            btc: new Big(data.btc).round(4).toNumber(),
            eth: new Big(data.btc).div(rate.ETHBTC).round(4).toNumber(),
            eur: new Big(data.btc * rate.BTCUSDT).div(rate.EURUSDT).round(4).toNumber(),
          },
          color: 'rgba(255,146,1,1)',
          sign: '฿',
        };
      } else {
        formatDataAllStrategies.btc.value.btc = new Big(formatDataAllStrategies.btc.value.btc).plus(data.btc).round(4).toNumber();
        formatDataAllStrategies.btc.value.eth = new Big(formatDataAllStrategies.btc.value.eth).plus(new Big(data.btc).div(rate.ETHBTC).round(4).toNumber()).round(4).toNumber()
        formatDataAllStrategies.btc.value.eur = new Big(formatDataAllStrategies.btc.value.eur).plus(new Big(data.btc * rate.BTCUSDT).div(rate.EURUSDT).round(4).toNumber()).round(4).toNumber();
      }
      if (!formatDataAllStrategies.eth) {
        formatDataAllStrategies.eth = {
          name: 'Ethereum',
          value: {
            btc: new Big(data.eth * rate.ETHBTC).round(3).toNumber(),
            eth: new Big(data.eth).round(3).toNumber(),
            eur: new Big(new Big(data.eth * rate.ETHUSDT).div(rate.EURUSDT).round(3).toNumber()).round(3).toNumber()
          },
          color: darkMode ? '#5A5A5A' : 'rgba(57,57,57,1)',
          sign: 'Ξ',
        };
      } else {
        formatDataAllStrategies.eth.value.btc = new Big(formatDataAllStrategies.eth.value.btc).plus(data.eth * rate.ETHBTC).round(3).toNumber();
        formatDataAllStrategies.eth.value.eth = new Big(formatDataAllStrategies.eth.value.eth).plus(data.eth).round(3).toNumber();
        formatDataAllStrategies.eth.value.eur = new Big(formatDataAllStrategies.eth.value.eur).plus(new Big(data.eth * rate.ETHUSDT).div(rate.EURUSDT).round(3).toNumber()).round(3).toNumber();
      }
      if (!formatDataAllStrategies.eur) {
        formatDataAllStrategies.eur = {
          //for Euro, data is converted directly from usdt with rate.EURUSDT
          name: 'Euro',
          value: {
            btc: new Big(data.usdt).div(rate.BTCUSDT).round(2).toNumber(),
            eth: new Big(data.usdt).div(rate.ETHUSDT).round(2).toNumber(),
            eur: new Big(data.usdt).div(rate.EURUSDT).round(2).toNumber(),
          },
          color: 'rgba(123,158,113,1)',
          sign: '€',
        };
      } else {
        formatDataAllStrategies.eur.value.btc = new Big(formatDataAllStrategies.eur.value.btc).plus(new Big(data.usdt).div(rate.BTCUSDT).round(2).toNumber()).round(2).toNumber();
        formatDataAllStrategies.eur.value.eth = new Big(formatDataAllStrategies.eur.value.eth).plus(new Big(data.usdt).div(rate.ETHUSDT).round(2).toNumber()).round(2).toNumber();
        formatDataAllStrategies.eur.value.eur = new Big(formatDataAllStrategies.eur.value.eur).plus(new Big(data.usdt).div(rate.EURUSDT).round(2).toNumber()).round(2).toNumber();
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
