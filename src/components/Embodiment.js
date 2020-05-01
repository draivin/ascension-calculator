import React from 'react';
import { Node } from './Node';
import { Cluster } from './Cluster';
import { EMBODIMENTS } from '../dataset';

export function Embodiment(props) {
  const clusters = [];
  const embodiment = EMBODIMENTS[props.name];

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
