import React, { Component } from 'react'
import styles from '../partial/Chart/Chart.module.css';


export default class ChartError extends Component {
    render() {
        return (
            <div className={styles.chart}>
                <canvas id='chart' ref={chartRef} />
            </div>
        )
    }
}
