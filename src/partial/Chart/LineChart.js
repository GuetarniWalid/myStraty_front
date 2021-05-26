import React, { useEffect, useRef, useContext, useState } from 'react';
import styles from './Chart.module.css';
import { CurrencyContext } from '../Providers';
import { WalletByDateContext } from '../Providers';
import { EnoughDatasContext } from '../Providers';
import { DarkContext } from '../Providers';
import { LineChartDataLoad } from '../Providers';
import { StrategyContext } from '../Providers';
import { EnoughtStratDatasContext } from '../Providers';
import { updateLineChart } from '../../functions/updateLineChart';
import useFetch from '../../hooks/useFetch';
import constructTooltip from '../../functions/constructToolTipLineChart';
import { lineChart } from '../../functions/lineChart';
import { isSameMonth, isSameWeek } from 'date-fns';
import { fr } from 'date-fns/locale';
import { lineChartData as defaultChartData } from '../../general/initialData/lineChartData';

export default function LineChart({ timeIntervalPortfolio }) {
  const [lineChartData, setLineChartData] = useState();
  const chartRef = useRef();
  const { currency } = useContext(CurrencyContext);
  const { setWalletByDate } = useContext(WalletByDateContext);
  const { strategySelected } = useContext(StrategyContext);
  const { enoughDatas, setEnoughDatas } = useContext(EnoughDatasContext);
  const { lineChartDataLoaded, setLineChartDataLoaded } = useContext(LineChartDataLoad);
  const { darkMode } = useContext(DarkContext);
  const { setEnoughStratDatas } = useContext(EnoughtStratDatasContext);
  const chartStored = useRef();
  const firstRenderLine = useRef(true);
  const execute = useFetch();

  //In first render
  useEffect(() => {
    let mounted = true;
    async function createChart() {
      const [amountsByDate, jsonRateEur] = await Promise.all([getStratDatas(strategySelected, !enoughDatas), getRatesData()]);
      //to avoid states change if the component is unmonted
      if (!mounted) return;

      const data = formatDatas(amountsByDate, jsonRateEur);
      const context = chartRef.current.getContext('2d');
      //In first render and if user does not have enough datas we display a fake lineChart
      chartStored.current = lineChart(currency, context, data, timeIntervalPortfolio, !enoughDatas, darkMode);

      if (data.labelsByDay.length < 1) {
        setEnoughStratDatas(false);
        return;
      } else setEnoughStratDatas(true);
      setLineChartData(data);
      setWalletByDate(data);
      setLineChartDataLoaded(true);
    }
    createChart();

    return function deleteChart() {
      mounted = false;
      // eslint-disable-next-line
      lineChartDataLoaded && setLineChartDataLoaded(false);
      // eslint-disable-next-line
      if (chartStored.current) chartStored.current.destroy();
    };
    // eslint-disable-next-line
  }, [enoughDatas, strategySelected]);

  async function getStratDatas(strategy, displayFakeData) {
    //determine url endpoint according "strategy"
    let endpoint;
    switch (strategy) {
      case 'TOTAL':
        endpoint = 'all/daily';
        break;
      default:
        const strat = strategy.split('/').join('_');
        endpoint = `byStrategy/${strat}`;
        break;
    }

    //Get user's trade history
    let amountsByDate;
    if (displayFakeData) {
      amountsByDate = defaultChartData;
    } else {
      try {
        const json = await execute(`${process.env.REACT_APP_URL_BACK}/api/v1/assets/${endpoint}`);
        if (json.success === false && json.details.type === 'expiry') {
          throw new Error(json.details.message);
        } else amountsByDate = json;
      } catch (e) {
        //if user aren't datas, no more treatment
        amountsByDate = [];
      }
    }
    return amountsByDate;
  }

  async function getRatesData() {
    //transform usdt values to eur values
    let jsonRateEur;
    try {
      const dataRateEur = await fetch(`https://v6.exchangerate-api.com/v6/${process.env.REACT_APP_EXCHANGE_RATE_API_KEY}/latest/USD`);
      jsonRateEur = await dataRateEur.json();
      //
      
      if(jsonRateEur.result !== 'success') throw new Error('exchangerate-api error, check api keys')

      //if an error occur, no more treatment
      jsonRateEur = {
        rates: {
          USD: 1 / jsonRateEur.conversion_rates.EUR,
        }
      }
    } catch (e) {
      console.error(e)
      jsonRateEur = {
        rates: {
          USD: 1.17,
        },
      };
    }
    return jsonRateEur;
  }

  function formatDatas(amountsByDate, jsonRateEur) {
    //manipulation of data to format one object "dataAsset"
    let labelsByDay = [];
    let labelsByWeek = [];
    let labelsByMonth = [];
    let btcByDay = [];
    let btcByWeek = [];
    let btcByMonth = [];
    let ethByDay = [];
    let ethByWeek = [];
    let ethByMonth = [];
    let usdtByDay = [];
    let usdtByWeek = [];
    let usdtByMonth = [];
    let tempMonthlyDate;
    let tempWeeklyDate;

    amountsByDate.forEach((item, index) => {
      //for monthly datas
      //one value per month is selected to pushed in monthly datas
      //the value selected is the first value of each month
      //first we push directly the index 0 value
      if (!index) {
        labelsByMonth.push(item.date);
        btcByMonth.push(item.BTC);
        ethByMonth.push(item.ETH);
        usdtByMonth.push(item.USDT);
        tempMonthlyDate = item.date;
      } else {
        //then we push each value where item's date is different than "tempMonthlyDate"
        if (!isSameMonth(new Date(item.date), new Date(tempMonthlyDate), { fr, weekStartsOn: 1 })) {
          labelsByMonth.push(item.date);
          btcByMonth.push(item.BTC);
          ethByMonth.push(item.ETH);
          usdtByMonth.push(item.USDT);
          tempMonthlyDate = item.date;
        }
        //finally we push the last value (actual date)
        if (index === amountsByDate.length - 1) {
          labelsByMonth.push(item.date);
          btcByMonth.push(item.BTC);
          ethByMonth.push(item.ETH);
          usdtByMonth.push(item.USDT);
        }
      }
      //

      //for weekly datas
      //one value per week is selected to pushed in weekly datas
      //the value selected is the first value of each week
      //first we push directly the index 0 value
      if (!index) {
        labelsByWeek.push(item.date);
        btcByWeek.push(item.BTC);
        ethByWeek.push(item.ETH);
        usdtByWeek.push(item.USDT);
        tempWeeklyDate = item.date;
      } else {
        //then we push each value where item's date is different than "tempWeeklyDate"
        if (!isSameWeek(new Date(item.date), new Date(tempWeeklyDate))) {
          labelsByWeek.push(item.date);
          btcByWeek.push(item.BTC);
          ethByWeek.push(item.ETH);
          usdtByWeek.push(item.USDT);
          tempWeeklyDate = item.date;
        }
        //finally we push the last value (actual date)
        if (index === amountsByDate.length - 1) {
          labelsByWeek.push(item.date);
          btcByWeek.push(item.BTC);
          ethByWeek.push(item.ETH);
          usdtByWeek.push(item.USDT);
          tempWeeklyDate = item.date;
        }
      }
      //

      //for dayly datas
      //fill values for each day
      labelsByDay.push(item.date);
      btcByDay.push(item.BTC);
      ethByDay.push(item.ETH);
      usdtByDay.push(item.USDT);
    });

    //transform usdt values to eur values
    const USDrate = jsonRateEur.rates.USD;
    const eurByDay = usdtByDay.map(value => value / USDrate);
    const eurByWeek = usdtByWeek.map(value => value / USDrate);
    const eurByMonth = usdtByMonth.map(value => value / USDrate);

    const dataAsset = {
      labelsByDay,
      labelsByMonth,
      labelsByWeek,
      eur: {
        currency: 'eur',
        valuesByDay: eurByDay,
        valuesByWeek: eurByWeek,
        valuesByMonth: eurByMonth,
      },
      btc: {
        currency: 'btc',
        valuesByDay: btcByDay,
        valuesByWeek: btcByWeek,
        valuesByMonth: btcByMonth,
      },
      eth: {
        currency: 'eth',
        valuesByDay: ethByDay,
        valuesByWeek: ethByWeek,
        valuesByMonth: ethByMonth,
      },
      usdt: {
        currency: 'usdt',
        valuesByDay: usdtByDay,
        valuesByWeek: usdtByWeek,
        valuesByMonth: usdtByMonth,
      },
    };
    return dataAsset;
  }

  //verify if the user has enough data to display
  useEffect(() => {
    let mounted = true;
    async function verifyQuantityData() {
      try {
        const response = await execute(`${process.env.REACT_APP_URL_BACK}/api/v1/assets/sufficient`);
        //to avoid states change if the component is unmonted
        if (!mounted) return;

        if (response.enoughDatas) setEnoughDatas(true);
      } catch (e) {
        console.log(e.message);
      }
    }
    verifyQuantityData();

    //cleanup function
    return () => (mounted = false);
    // eslint-disable-next-line
  }, []);

  //update lineChart
  useEffect(() => {
    function updateLineChartIfNotFirstRender() {
      if (!firstRenderLine.current) {
        updateLineChart(chartStored.current, lineChartData, timeIntervalPortfolio, currency, enoughDatas);
      }
    }
    updateLineChartIfNotFirstRender();
    firstRenderLine.current = false;
    // eslint-disable-next-line
  }, [currency, timeIntervalPortfolio]);

  //update lineChart DarkMode
  useEffect(() => {
    //only if lineChart is monted
    if (!chartStored.current || !lineChartDataLoaded) return;
    chartStored.current.options.scales.xAxes[0].ticks.fontColor = darkMode ? '#f3f1ff' : '#000';
    chartStored.current.options.scales.yAxes[0].ticks.fontColor = darkMode ? '#f3f1ff' : '#000';
    chartStored.current.options.scales.xAxes[0].gridLines.color = darkMode ? '#47475D' : '#F9FAFA';
    chartStored.current.options.scales.yAxes[0].gridLines.color = darkMode ? '#47475D' : '#F9FAFA';
    chartStored.current.options.tooltips = {
      enabled: false,
      xPadding: 10,
      yPadding: 5,
      caretPadding: 10,
      custom: !enoughDatas
        ? null
        : function (tooltipModel) {
            const construct = constructTooltip.bind(this);
            construct(tooltipModel, lineChartData, darkMode);
          },
    };
    chartStored.current.update();

    // eslint-disable-next-line
  }, [darkMode, chartStored.current]);

  return (
    <div className={darkMode ? `${styles.chart} ${styles.dark}` : styles.chart}>
      <canvas id='chart' ref={chartRef} />
    </div>
  );
}
