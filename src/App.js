import React from 'react';
import './App.css';
import { Overview } from './Overview';
import { Embodiment } from './Embodiment';
import ReactTooltip from 'react-tooltip';
import { CalculatorProvider, embodimentNames } from './CalculatorContext';

function App() {
  return (
    <CalculatorProvider>
      <div className="calculator">
        <div className="embodiments">
          {embodimentNames.map((embodiment) => (
            <Embodiment name={embodiment} />
          ))}
        </div>
        <Overview />
      </div>
      <ReactTooltip className="tooltip" effect="solid" multiline="true" />
    </CalculatorProvider>
  );
}

export default App;
