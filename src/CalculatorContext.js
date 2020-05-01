import React, { useReducer } from 'react';

const ascensionData = require('./ascension.json');
export const schoolNames = ['force', 'entropy', 'form', 'inertia', 'life'];
export const clusters = { root: { nodes: {}, rewards: {} } };
export const schools = {};
schoolNames.forEach(
  (school) =>
    (clusters.root.nodes[school] = {
      description: `+1 ${school[0].toUpperCase()}${school.substring(1)}.`,
    })
);
schoolNames.forEach((school) => (schools[school] = []));

for (let cluster of ascensionData) {
  clusters[cluster.name] = cluster;
  schools[cluster.school].push(cluster);
}

export const CalculatorContext = React.createContext(null);

export function isNodeSelected(node, selectedNodes) {
  return `${node.cluster}.${node.index}` in selectedNodes;
}

export function isNodeSelectable(node, state) {
  if (node.cluster == 'root') return true;

  const cluster = clusters[node.cluster];
  const clusterAvailable = isClusterAvailable(cluster, state);
  return (
    (clusterAvailable && node.index == 0) ||
    (clusterAvailable &&
      isNodeSelected({ cluster: node.cluster, index: node.index - 1 }, state.nodes))
  );
}

function isNodeDeselectable(node, state) {
  return !isNodeSelected({ cluster: node.cluster, index: node.index + 1 }, state.nodes);
}

export function getSelectedSubnode(node, selectedNodes) {
  return selectedNodes[`${node.cluster}.${node.index}`];
}

export function isClusterComplete(cluster, selectedNodes) {
  for (let i = 0; i < cluster.nodes.length; i++) {
    if (!isNodeSelected({ cluster: cluster.name, index: i }, selectedNodes)) return false;
  }

  return true;
}

export function isClusterAvailable(cluster, state) {
  for (let school in cluster.requirements) {
    if (state.points[school] < cluster.requirements[school]) return false;
  }

  return true;
}

function isValidState({ nodes, points }) {
  let clusterNames = {};
  for (let nodeId in nodes) {
    clusterNames[nodeId.split('.')[0]] = true;
  }

  for (let clusterName in clusterNames) {
    const cluster = clusters[clusterName];
    for (let school in cluster.requirements) {
      if (points[school] < cluster.requirements[school]) {
        return false;
      }
    }
  }

  return true;
}

function reducer(state, action) {
  const newNodes = { ...state.nodes };
  const newPoints = { ...state.points };
  const node = action.node;
  const cluster = clusters[node.cluster];

  switch (action.type) {
    case 'select':
      if (!isNodeSelectable(node, state)) break;
      newNodes[`${node.cluster}.${node.index}`] = node.subnode;

      if (isClusterComplete(cluster, newNodes)) {
        for (let school in cluster.rewards) {
          newPoints[school] += cluster.rewards[school];
        }
      }

      if (node.bonusPoint) {
        newPoints[node.bonusPoint] += 1;
      }

      break;

    case 'deselect':
      if (!isNodeDeselectable(node, state)) break;

      if (cluster && isClusterComplete(cluster, newNodes)) {
        for (let school in cluster.rewards) {
          newPoints[school] -= cluster.rewards[school];
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
