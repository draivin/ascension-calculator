import React, { useContext } from 'react';
import classNames from 'classnames';
import { Node } from './Node';
import { CLUSTERS } from '../dataset';
import { CalculatorContext } from '../state/CalculatorContext';
import { isClusterAvailable, isClusterComplete } from '../state/util';

export function Cluster({ name }) {
  const { state } = useContext(CalculatorContext);

  const cluster = CLUSTERS[name];
  const isAvailable = isClusterAvailable(cluster, state);
  const isComplete = isAvailable && isClusterComplete(cluster, state);

  const requirements = [];
  for (let embodiment in cluster.requirements) {
    requirements.push(
      <div className={`point ${embodiment}`}>{cluster.requirements[embodiment]}</div>
    );
  }

  const rewards = [];
  for (let embodiment in cluster.rewards) {
    rewards.push(<div className={`point ${embodiment}`}>{cluster.rewards[embodiment]}</div>);
  }

  const nodes = [];
  for (let i = 0; i < cluster.nodes.length; i++) {
    nodes.push(<Node cluster={name} index={i} />);
  }

  return (
    <div className={classNames('cluster', { available: isAvailable, complete: isComplete })}>
      <div className="requirements points">{requirements}</div>
      <div className="cluster-name"> {name} </div>
      <div className="rewards points">{rewards}</div>
      <div className="nodes">{nodes}</div>
    </div>
  );
}
