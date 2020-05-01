import React, { useContext } from 'react';
import classNames from 'classnames';
import { CalculatorContext } from '../state/CalculatorContext';
import { isNodeSelected, isNodeSelectable, getSelectedSubnode } from '../state/util';
import { CLUSTERS } from '../dataset';
import { tooltipHtml } from './NodeTooltip';

export function Node({ cluster, index }) {
  const nodeInfo = { cluster, index };
  const { state, dispatch } = useContext(CalculatorContext);
  const isSelected = isNodeSelected(nodeInfo, state);
  const isSelectable = !isSelected && isNodeSelectable(nodeInfo, state);
  const selectedSubnode = isSelected && getSelectedSubnode(nodeInfo, state);
  const node = CLUSTERS[cluster].nodes[index];

  function onClick(subnode) {
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
        node: { ...nodeInfo },
      });
    }
  }

  if (node.subnodes && node.subnodes.length) {
    const subnodeElements = [];
    for (let i = 0; i < node.subnodes.length; i++) {
      subnodeElements.push(
        <div
          className={classNames('subnode', { selected: isSelected && selectedSubnode == i })}
          onClick={() => onClick(i)}
        >
          {i + 1}
        </div>
      );
    }

    return (
      <div
        data-tip={tooltipHtml(nodeInfo)}
        className={classNames('node subnodes', { selected: isSelected, selectable: isSelectable })}
      >
        {subnodeElements}
      </div>
    );
  } else {
    return (
      <div
        data-tip={tooltipHtml(nodeInfo)}
        className={classNames('node', { selected: isSelected, selectable: isSelectable })}
        onClick={() => onClick(-1)}
      ></div>
    );
  }
}
