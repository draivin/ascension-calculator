const ascensionData = require('./ascension.json');

export const EMBODIMENT_NAMES = ['force', 'entropy', 'form', 'inertia', 'life'];
export const CLUSTERS = { root: { nodes: {}, rewards: {} } };
export const EMBODIMENTS = {};

EMBODIMENT_NAMES.forEach(
  (embodiment) =>
    (CLUSTERS.root.nodes[embodiment] = {
      description: `+1 ${embodiment[0].toUpperCase()}${embodiment.substring(1)}.`,
    })
);
EMBODIMENT_NAMES.forEach((embodiment) => (EMBODIMENTS[embodiment] = []));

for (let cluster of ascensionData) {
  CLUSTERS[cluster.name] = cluster;
  EMBODIMENTS[cluster.embodiment].push(cluster);
}
