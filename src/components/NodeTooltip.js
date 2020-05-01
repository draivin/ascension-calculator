import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { CLUSTERS } from '../dataset';

export function NodeTooltip({ cluster, index }) {
  const node = CLUSTERS[cluster].nodes[index];
  const subnodes = node.subnodes;

  const descriptionLines = node.description.replace(/»/g, '').split('\n');
  const subnodeDescriptions = [];

  if (subnodes && subnodes.length) {
    for (let i = 0; i < subnodes.length; i++) {
      const subnodeLines = subnodes[i].replace(/»/g, '').split('\n');

      subnodeDescriptions.push(
        <div className="subnode-description">
          <span className="subnode-number">{i + 1})</span>
          <span className="subnode-lines">
            {subnodeLines.map((line) => (
              <span className="description-line">{line}</span>
            ))}
          </span>
        </div>
      );
    }
  }

  return (
    <div>
      <div className="node-description">
        {descriptionLines.map((line) => (
          <span className="description-line">{line}</span>
        ))}
      </div>
      {subnodeDescriptions}
    </div>
  );
}

export function tooltipHtml({ cluster, index }) {
  return ReactDOMServer.renderToStaticMarkup(<NodeTooltip cluster={cluster} index={index} />);
}
