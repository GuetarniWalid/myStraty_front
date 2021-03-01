import React from 'react'

export default function TopbarCurrency({logo, styles, selected, currency, setCurrency}) {

    return (
        //set currency Context when clicked
        selected ? <i onClick={() => setCurrency(currency)} className={`${logo} ${styles[currency]}`} ></i> : <i onClick={() => setCurrency(currency)} className={`${logo} ${styles[currency]} ${styles.unselected}`} ></i>

    )
}
