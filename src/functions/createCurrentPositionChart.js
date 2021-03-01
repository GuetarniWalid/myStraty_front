import {currentPositionChart} from './currentPositionChart'

export const createCurrentPositionChart = (chartRef, data, darkMode, error) => {
    const labels = ['usd', 'btc', 'eth']
    const BTCValue = data['BTC-USD'] * 100 
    const ETHValue = data['ETH-USD'] * 100
    const USDTValue = 100 - BTCValue - ETHValue

    const context = chartRef.current.getContext('2d');
    const chart = currentPositionChart(context, labels, USDTValue, BTCValue, ETHValue, darkMode, error)

    return chart
}