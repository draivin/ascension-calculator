import React, { useReducer } from 'react';
import { CLUSTERS } from '../dataset';
import { isNodeSelectable, isClusterComplete, isNodeDeselectable, isValidState } from './util';

export const CalculatorContext = React.createContext(null);

function reducer(state, action) {
  const newNodes = { ...state.nodes };
  const newPoints = { ...state.points };
  const node = action.node;
  const cluster = CLUSTERS[node.cluster];

  switch (action.type) {
    case 'select':
      if (!isNodeSelectable(node, state)) break;
      newNodes[`${node.cluster}.${node.index}`] = node.subnode;

      if (isClusterComplete(cluster, { ...state, nodes: newNodes })) {
        for (let embodiment in cluster.rewards) {
          newPoints[embodiment] += cluster.rewards[embodiment];
        }
      }

      if (node.bonusPoint) {
        newPoints[node.bonusPoint] += 1;
      }

      break;

    case 'deselect':
      if (!isNodeDeselectable(node, state)) break;

      if (cluster && isClusterComplete(cluster, { ...state, nodes: newNodes })) {
        for (let embodiment in cluster.rewards) {
          newPoints[embodiment] -= cluster.rewards[embodiment];
        }
      }

      if (node.bonusPoint) {
        newPoints[node.bonusPoint] -= 1;
      }

      delete newNodes[`${node.cluster}.${node.index}`];
      break;

    case 'reselect':
      if (node.bonusPoint) {
        newPoints[node.bonusPoint] += 1;
      }
      if (node.prevBonusPoint) {
        newPoints[node.prevBonusPoint] -= 1;
      }

      newNodes[`${node.cluster}.${node.index}`] = node.subnode;
      break;
  }

  if (!isValidState({ nodes: newNodes, points: newPoints })) return state;
  return { nodes: newNodes, points: newPoints };
}

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
  });

  return (
    <CalculatorContext.Provider value={{ state, dispatch }}>{children}</CalculatorContext.Provider>
  );
}
