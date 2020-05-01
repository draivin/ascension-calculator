const fs = require('fs');
const parse = require('csv-parse/lib/sync');

const input = fs.readFileSync('ascension.csv', 'utf-8');

const records = parse(input);

function parsePoints(line) {
  if (line.includes(':')) line = line.split(':')[1].trim();
  let entries = line
    .toLowerCase()
    .replace(/\./g, '')
    .split(',')
    .map((s) => s.trim());

  const points = {};
  for (let entry of entries) {
    const [value, school] = entry.split(' ');
    points[school] = Number(value);
  }

  return points;
}

function parseCluster(x, y) {
  const rawName = records[y][x];
  let [school, name] = rawName.split(':').map((s) => s.trim());
  school = school.toLowerCase();

  const description = records[y + 1][x];

  const rawRequirements = records[y + 2][x];
  let [requirements, rewards] = rawRequirements.split('\n');
  requirements = parsePoints(requirements);
  rewards = rewards ? parsePoints(rewards) : {};

  const nodes = [];

  let row = y + 3;
  let currentNode;
  while (records[row] && records[row][x]) {
    const node = records[row][x];
    const nodeDescription = records[row][x + 1];

    let nodeNumber = node.split('_')[1];
    if (!nodeNumber.includes('.')) {
      currentNode = { description: nodeDescription, subnodes: [] };
      nodes.push(currentNode);
    } else {
      currentNode.subnodes.push(nodeDescription);
    }

    row += 1;
  }

  return {
    name,
    school,
    description,
    requirements,
    rewards,
    nodes,
  };
}

function parseColumn(x) {
  let inNode = false;
  let clusters = [];
  for (let row = 0; row < records.length; row++) {
    if (!inNode && records[row][x]) {
      inNode = true;
      clusters.push(parseCluster(x, row));
    } else if (inNode && !records[row][x]) inNode = false;
  }

  return clusters;
}

const clusters = parseColumn(0);
clusters.push(...parseColumn(6));
clusters.push(...parseColumn(12));

fs.writeFileSync('ascension.json', JSON.stringify(clusters, null, '  '));
