import React from 'react';
import './App.css';
import ReactTooltip from 'react-tooltip';
import { CalculatorProvider } from './state/CalculatorContext';
import { EMBODIMENT_NAMES } from './dataset';
import { Embodiment } from './components/Embodiment';
import { Overview } from './components/Overview';

function App() {
  return (
    <CalculatorProvider>
      <div className="calculator">
        <div className="embodiments">
          {EMBODIMENT_NAMES.map((embodiment) => (
            <Embodiment name={embodiment} />
          ))}
        </div>
        <Overview />
      </div>
      <ReactTooltip className="tooltip" effect="solid" html={true} multiline={true} />
    </CalculatorProvider>
  );
}

export default App;
