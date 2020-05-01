import React from 'react';
import './App.css';
import { Overview } from './Overview';
import { School } from './School';
import ReactTooltip from 'react-tooltip';
import { CalculatorProvider, schoolNames } from './CalculatorContext';

function App() {
  return (
    <CalculatorProvider>
      <div className="calculator">
        <div className="schools">
          {schoolNames.map((school) => (
            <School name={school} />
          ))}
        </div>
        <Overview />
      </div>
      <ReactTooltip className="tooltip" effect="solid" multiline="true" />
    </CalculatorProvider>
  );
}

export default App;
