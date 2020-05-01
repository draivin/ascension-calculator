import React, { useReducer } from 'react';
import { reducer } from './reducers';

export const CalculatorContext = React.createContext(null);

export function CalculatorProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, {
    nodes: {},
    points: {
      force: 0,
      entropy: 0,
      form: 0,
      inertia: 0,
      life: 0,
    },
    filter: '',
  });

  return (
    <CalculatorContext.Provider value={{ state, dispatch }}>{children}</CalculatorContext.Provider>
  );
}
