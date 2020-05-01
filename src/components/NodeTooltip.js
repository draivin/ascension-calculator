import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { CLUSTERS } from '../dataset';

export function NodeTooltip({ cluster, index }) {
  const node = CLUSTERS[cluster].nodes[index];
  const subnodes = node.subnodes;

  const description = node.description;
  const subnodeDescriptions = [];

  if (subnodes && subnodes.length) {
    for (let i = 0; i < subnodes.length; i++) {
      subnodeDescriptions.push(
        <div>
          {i + 1}) {subnodes[i].trim()}
        </div>
      );
    }
  }

  return (
    <div>
      <div>{description}</div>
      {subnodeDescriptions}
    </div>
  );
}

export function tooltipHtml({ cluster, index }) {
  return ReactDOMServer.renderToStaticMarkup(<NodeTooltip cluster={cluster} index={index} />);
}
