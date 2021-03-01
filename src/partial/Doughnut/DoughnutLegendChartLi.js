import React from 'react';

export default function DoughnutLegendChartLi({ name, value, color, sign, setCurrencySelected, currency }) {
  return (
    <li onClick={() => setCurrencySelected(currency)} style={{cursor: 'pointer'}} >
      <span style={{ background: color }} />
      <span>{name}</span>
      <span>
        {sign} {value}
      </span>
    </li>
  );
}
