import React from 'react';
import { Node } from './Node';
import { Cluster } from './Cluster';
import { schools } from './CalculatorContext';

export function School(props) {
  const clusters = [];
  const school = schools[props.name];

  for (let cluster of school) {
    clusters.push(<Cluster name={cluster.name} />);
  }

  return (
    <div className="school">
      <div className="school-name">
        {props.name}
        <Node cluster="root" index={props.name} />
      </div>
      <div className="clusters">{clusters}</div>
    </div>
  );
}
