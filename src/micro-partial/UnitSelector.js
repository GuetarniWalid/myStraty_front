import React, {useContext} from 'react';
import {DarkContext} from '../partial/Providers'

const stylesSelected = {
  color: '#3276EB',
  background: '#E7EFFC',
};

const stylesSelectedDark = {
  color: 'rgb(125, 183, 220)',
  background: '#47475D',
}


export default function UnitSelector({ selected, text, setFunction, dataLoaded }) {
  const {darkMode} = useContext(DarkContext)

  return <span onClick={dataLoaded ? () => setFunction(text) : null} style={selected ? darkMode ? stylesSelectedDark : stylesSelected : null}>{text}</span>
}
