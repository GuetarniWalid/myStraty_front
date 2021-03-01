import {format, formatDistanceToNowStrict} from 'date-fns'
import { fr } from 'date-fns/locale'

export const formatDate = (date, formatStyle) => {
  return format(new Date(date), formatStyle, {
    locale: fr,
  })
}

export const formatDateDistanceToNowStrict = (date) => {
  return formatDistanceToNowStrict(new Date(date), {
    locale: fr,
    addSuffix: true
  })
}


export function formatNumber(number, afterDot) {
  const numberInString = String(number);
  const numberSplitted = numberInString.split('.');
  //if not number after dot, notreatment
  if (numberSplitted.length < 2) return number;
  //

  //format number before dot
  if(numberSplitted[0].length > 3) {
  let numberBeforeDotInArray = numberSplitted[0].split('')
  const numberBeforeDotInArrayReversed = numberBeforeDotInArray.reverse()
  //add a space after 3 number to french format
  numberBeforeDotInArrayReversed.splice(3, 0, ' ')
  numberBeforeDotInArray = numberBeforeDotInArrayReversed.reverse()
  numberSplitted[0] = numberBeforeDotInArray.join('')
  }
  //

  //format number after dot
  numberSplitted[1] = numberSplitted[1].substring(0, afterDot);
  return numberSplitted.join('.');
}

export function formatCurrency(number, currency) {
  if(currency === 'eur') return formatNumber(number, 2)
  if(currency === 'usd') return formatNumber(number, 2)
  if(currency === 'usdt') return formatNumber(number, 2)
  if(currency === 'eth') return formatNumber(number, 3)
  if(currency === 'btc') return formatNumber(number, 4)
}

export function filterTradeBuy(trades) {
  return trades.filter(trade => trade.action === 'BUY')
}

export function filterTradeSell(trades) {
  return trades.filter(trade => trade.action === 'SELL')
}

export function filterCurrencyBTC(trades) {
  return trades.filter(trade => trade.pair === 'BTCUSDT')
}

export function filterCurrencyETH(trades) {
  return trades.filter(trade => trade.pair.substring(0, 3) === 'ETH')
}


export function convert(value, pair, base, rate) {
  //determine in which currency is the value
  const valueCurrency = pair.substring(0, 3).toLowerCase()
  //
  //if value is already convert, so no more treatment
  if(valueCurrency === base) return value
  //
  const {pairRate, calculationSign} = determinePairRateAndCalculationSign(valueCurrency, base)

  return calculationSign === 'multiplied' ? value * Number(rate[pairRate]) : value / Number(rate[pairRate])
}

export function formatTitleStrat(title) {
  //replace backslash by underscore
  return title.split('/').join('_')
}

export const parseJwt = (token) => {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (e) {
    return null;
  }
};

export const verifyTokenExpiration = (token) => {
    const expireIn = token.data.expireIn
    //convert iat in millisecond
    const iat = token.iat * 1000
    const now = Date.now()
    //calculate if token expiry time isn't passed
    const isTokenExpiry = (expireIn + iat) < now
    return isTokenExpiry
}

export const formatFirstLetterUppercase = (word) => {
  return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
}


/****** Functions no exported ******/
function determinePairRateAndCalculationSign(actualBase, base) {
  const UpperCaseActualBase = actualBase.toUpperCase()
  const UpperCaseBase = base.toUpperCase()
  if(actualBase === 'eth') return {pairRate: UpperCaseActualBase + UpperCaseBase, calculationSign: 'multiplied'}
  else if(base === 'eth') return {pairRate: UpperCaseBase + UpperCaseActualBase, calculationSign: 'divided'}
  else if(actualBase === 'btc') return {pairRate: UpperCaseActualBase + UpperCaseBase, calculationSign: 'multiplied'}
  else return {pairRate: UpperCaseBase + UpperCaseActualBase, calculationSign: 'divided'}
}