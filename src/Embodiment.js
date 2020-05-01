import React from 'react';
import { Node } from './Node';
import { Cluster } from './Cluster';
import { embodiments } from './CalculatorContext';

export function Embodiment(props) {
  const clusters = [];
  const embodiment = embodiments[props.name];

  for (let cluster of embodiment) {
    clusters.push(<Cluster name={cluster.name} />);
  }

  return (
    <div className="embodiment">
      <div className="embodiment-name">
        {props.name}
        <Node cluster="root" index={props.name} />
      </div>
      <div className="clusters">{clusters}</div>
    </div>
  );
}
