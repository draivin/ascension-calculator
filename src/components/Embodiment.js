import React from 'react';
import { Node } from './Node';
import { Cluster } from './Cluster';
import { EMBODIMENTS } from '../dataset';

export function Embodiment({ name }) {
  const clusters = [];
  const embodiment = EMBODIMENTS[name];

  for (let cluster of embodiment) {
    clusters.push(<Cluster name={cluster.name} />);
  }

  return (
    <div className="embodiment">
      <div className="embodiment-name">
        {name}
        <Node cluster="root" index={name} />
      </div>
      <div className="clusters">{clusters}</div>
    </div>
  );
}
