import {performanceChart} from './performanceChart'


export const createPerformanceChart = (chartRef, datas, darkMode, error) => {
    const labels = datas.map(data => data[0])
    const dataAssets = datas.map(data => data[1])    
    const context = chartRef.current.getContext('2d');
    const chart = performanceChart(context, labels, dataAssets, darkMode, error)
    return chart
}