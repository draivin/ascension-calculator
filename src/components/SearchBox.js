import React, { useContext } from 'react';
import { CalculatorContext } from '../state/CalculatorContext';

export function SearchBox() {
  const { dispatch } = useContext(CalculatorContext);
  function handler(value) {
    dispatch({ type: 'filter', filter: value });
  }

  return <input className="searchbox" onChange={(e) => handler(e.target.value)}></input>;
}
