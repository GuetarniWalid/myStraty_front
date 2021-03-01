import React, { createContext, useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import AlertCard from '../micro-partial/AlertCard';
export const CurrencyContext = createContext('eur');
export const RateContext = createContext({});
export const WalletContext = createContext({});
export const WalletByDateContext = createContext({});
export const DataByStrategyContext = createContext([]);
export const StrategyContext = createContext('TOTAL');
export const RefreshStrategyContext = createContext(0);
export const AlertContext = createContext();
export const EnoughDatasContext = createContext();
export const LoggedInContext = createContext();
export const SubscribeContext = createContext();
export const PlanContext = createContext();
export const TesterContext = createContext();
export const UserContext = createContext();
export const DarkContext = createContext();
export const LineChartDataLoad = createContext();
export const BarChartDataLoad = createContext();
export const EnoughtStratDatasContext = createContext();
export const CoverContext = createContext();

export default function Providers({ children }) {
  const [currency, setCurrency] = useState('eur');
  const [rate, setRate] = useState({});
  const [wallet, setWallet] = useState({});
  const [walletByDate, setWalletByDate] = useState();
  const [dataByStrategy, setDataByStrategy] = useState([]);
  const [strategySelected, setStrategySelected] = useState('TOTAL');
  const [refresh, setRefresh] = useState(0);
  const [card, setCard] = useState();
  const [enoughDatas, setEnoughDatas] = useState(false);
  const [enoughStratDatas, setEnoughStratDatas] = useState(true);
  const [loggedIn, setLoggedIn] = useState(true);
  const [isSubscribe, setIsSubscribe] = useState(true);
  const [isTester, setIsTester] = useState();
  const [plan, setPlan] = useState();
  const [user, setUser] = useState({male: true});
  const [darkMode, setDarkMode] = useState(false);
  const [lineChartDataLoaded, setLineChartDataLoaded] = useState(false);
  const [barChartDataLoaded, setBarChartDataLoaded] = useState(false);
  const [coverAll, setCoverAll] = useState(false);

  //verify the token validity of user and redirect to home if token not validate
  useEffect(() => {
    async function isLogged() {
      try {
        const userId = localStorage.getItem('userId');
        const token = localStorage.getItem('token');
        const data = await fetch(`${process.env.REACT_APP_URL_BACK}/api/v1/user/status/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const json = await data.json();
        if (json.loggedIn === false) setLoggedIn(false);
      } catch (e) {
        console.log(e.message);
      }
    }
    isLogged();
  }, []);

  //set the darkMode
  useEffect(() => {
    const darkMode = localStorage.getItem('darkMode') === 'true'
    setDarkMode(darkMode)
  }, [])

  return (
    <>
      {!loggedIn && <Redirect to='/' />}
      <CurrencyContext.Provider value={{ currency, setCurrency }}>
        <RateContext.Provider value={{ rate, setRate }}>
          <WalletContext.Provider value={{ wallet, setWallet }}>
            <WalletByDateContext.Provider value={{ walletByDate, setWalletByDate }}>
              <DataByStrategyContext.Provider value={{ dataByStrategy, setDataByStrategy }}>
                <StrategyContext.Provider value={{ strategySelected, setStrategySelected }}>
                  <RefreshStrategyContext.Provider value={{ refresh, setRefresh }}>
                    <AlertContext.Provider value={{ setCard }}>
                      <EnoughDatasContext.Provider value={{ enoughDatas, setEnoughDatas }}>
                        <LoggedInContext.Provider value={{ loggedIn, setLoggedIn }}>
                          <SubscribeContext.Provider value={{ isSubscribe, setIsSubscribe }}>
                            <PlanContext.Provider value={{ plan, setPlan }}>
                              <TesterContext.Provider value={{ isTester, setIsTester }}>
                                <UserContext.Provider value={{ user, setUser }}>
                                  <DarkContext.Provider value={{ darkMode, setDarkMode }}>
                                    <LineChartDataLoad.Provider value={{ lineChartDataLoaded, setLineChartDataLoaded }}>
                                    <BarChartDataLoad.Provider value={{ barChartDataLoaded, setBarChartDataLoaded }}>
                                      <EnoughtStratDatasContext.Provider value={{enoughStratDatas, setEnoughStratDatas}}>
                                        <CoverContext.Provider value={{coverAll, setCoverAll}}>
                                          {children}
                                        </CoverContext.Provider>
                                      </EnoughtStratDatasContext.Provider>
                                      </BarChartDataLoad.Provider>
                                      </LineChartDataLoad.Provider>
                                  </DarkContext.Provider>
                                </UserContext.Provider>
                              </TesterContext.Provider>
                            </PlanContext.Provider>
                          </SubscribeContext.Provider>
                        </LoggedInContext.Provider>
                      </EnoughDatasContext.Provider>
                    </AlertContext.Provider>
                  </RefreshStrategyContext.Provider>
                </StrategyContext.Provider>
              </DataByStrategyContext.Provider>
            </WalletByDateContext.Provider>
          </WalletContext.Provider>
        </RateContext.Provider>
      </CurrencyContext.Provider>

      {card && <AlertCard title={card.title} text={card.text} type={card.type} setMount={setCard} time={card.time} />}
    </>
  );
}
