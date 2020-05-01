import React, { useReducer } from 'react';
import { CLUSTERS } from '../dataset';
import {
  isNodeSelectable,
  isClusterComplete,
  isNodeDeselectable,
  isValidState,
  getNodeId,
} from './util';

export const CalculatorContext = React.createContext(null);

const BONUS_REGEX = /\+1 (Force|Entropy|Form|Inertia|Life)./;

function getBonusPoint({ cluster, index, subnode }) {
  const node = CLUSTERS[cluster].nodes[index];

  let bonusPoint = null;
  let match = node.description.match(BONUS_REGEX);
  if (subnode != -1 && !match) match = node.subnodes[subnode].match(BONUS_REGEX);
  if (match) bonusPoint = match[1].toLowerCase();

  return bonusPoint;
}

function reducer(state, { type, node }) {
  const nodeId = getNodeId(node);
  const cluster = CLUSTERS[node.cluster];

  const newNodes = { ...state.nodes };
  const newPoints = { ...state.points };

  const bonusPoint = getBonusPoint(node);

  switch (type) {
    case 'select':
      if (!isNodeSelectable(node, state)) break;
      newNodes[nodeId] = node.subnode;

      if (isClusterComplete(cluster, { ...state, nodes: newNodes })) {
        for (let embodiment in cluster.rewards) {
          newPoints[embodiment] += cluster.rewards[embodiment];
        }
      }

      if (bonusPoint) newPoints[bonusPoint] += 1;

      break;

    case 'deselect':
      if (!isNodeDeselectable(node, state)) break;

      if (cluster && isClusterComplete(cluster, { ...state, nodes: newNodes })) {
        for (let embodiment in cluster.rewards) {
          newPoints[embodiment] -= cluster.rewards[embodiment];
        }
      }

      if (bonusPoint) newPoints[bonusPoint] -= 1;

      delete newNodes[nodeId];
      break;

    case 'reselect':
      const prevBonusPoint = getBonusPoint({ ...node, subnode: state.nodes[nodeId] });
      if (bonusPoint) newPoints[bonusPoint] += 1;
      if (prevBonusPoint) newPoints[prevBonusPoint] -= 1;

      newNodes[nodeId] = node.subnode;
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
