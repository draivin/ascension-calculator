import React, { useContext } from 'react';
import classNames from 'classnames';
import { CalculatorContext } from '../state/CalculatorContext';
import { isNodeSelected, isNodeSelectable, getSelectedSubnode } from '../state/util';
import { CLUSTERS } from '../dataset';
import { tooltipHtml } from './NodeTooltip';

export function Node({ cluster, index }) {
  const { state, dispatch } = useContext(CalculatorContext);

  const nodeInfo = { cluster, index };
  const isSelected = isNodeSelected(nodeInfo, state);
  const isSelectable = !isSelected && isNodeSelectable(nodeInfo, state);
  const selectedSubnode = isSelected && getSelectedSubnode(nodeInfo, state);

  const node = CLUSTERS[cluster].nodes[index];

  let text = node.description;
  if (node.subnodes) text += node.subnodes.join(' ');
  text = text.toLowerCase();

  const matchesFilter = !state.filter || text.includes(state.filter);

  function handler(subnode) {
    if (!isSelected) {
      dispatch({
        type: 'select',
        node: { subnode, ...nodeInfo },
      });
    } else if (subnode != selectedSubnode) {
      dispatch({
        type: 'reselect',
        node: { subnode, ...nodeInfo },
      });
    } else {
      dispatch({
        type: 'deselect',
        node: { subnode, ...nodeInfo },
      });
    }
  }

  const className = classNames('node', {
    selected: isSelected,
    selectable: isSelectable,
    filtered: !matchesFilter,
  });

  if (node.subnodes && node.subnodes.length) {
    const subnodeElements = [];
    for (let i = 0; i < node.subnodes.length; i++) {
      subnodeElements.push(
        <div
          className={classNames('subnode', { selected: isSelected && selectedSubnode == i })}
          onClick={() => handler(i)}
        >
          {i + 1}
        </div>
      );
    }

    return (
      <div data-tip={tooltipHtml(nodeInfo)} className={classNames(className, 'subnodes')}>
        {subnodeElements}
      </div>
    );
  } else {
    return (
      <div data-tip={tooltipHtml(nodeInfo)} className={className} onClick={() => handler(-1)}></div>
    );
  }
}
