import { CLUSTERS } from '../dataset';

export function isNodeSelected(node, selectedNodes) {
  return `${node.cluster}.${node.index}` in selectedNodes;
}

export function isNodeSelectable(node, state) {
  if (node.cluster == 'root') return true;

  const cluster = CLUSTERS[node.cluster];
  const clusterAvailable = isClusterAvailable(cluster, state);
  return (
    (clusterAvailable && node.index == 0) ||
    (clusterAvailable &&
      isNodeSelected({ cluster: node.cluster, index: node.index - 1 }, state.nodes))
  );
}

export function isNodeDeselectable(node, state) {
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
  for (let embodiment in cluster.requirements) {
    if (state.points[embodiment] < cluster.requirements[embodiment]) return false;
  }

  return true;
}

export function isValidState({ nodes, points }) {
  let clusterNames = {};
  for (let nodeId in nodes) {
    clusterNames[nodeId.split('.')[0]] = true;
  }

  for (let clusterName in clusterNames) {
    const cluster = CLUSTERS[clusterName];
    for (let embodiment in cluster.requirements) {
      if (points[embodiment] < cluster.requirements[embodiment]) {
        return false;
      }
    }
  }

  return true;
}
