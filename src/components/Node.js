import React, { useContext } from 'react';
import classNames from 'classnames';
import { CalculatorContext } from '../state/CalculatorContext';
import { isNodeSelected, isNodeSelectable, getSelectedSubnode } from '../state/util';
import { CLUSTERS } from '../dataset';

const BONUS_REGEX = /\+1 (Force|Entropy|Form|Inertia|Life)./;

export function Node(props) {
  const { state, dispatch } = useContext(CalculatorContext);
  const isSelected = isNodeSelected(props, state);
  const isSelectable = !isSelected && isNodeSelectable(props, state);
  const selectedSubnode = isSelected && getSelectedSubnode(props, state);
  const node = CLUSTERS[props.cluster].nodes[props.index];

  function onClick(subnode) {
    let bonusPoint;

    let match = node.description.match(BONUS_REGEX);
    if (subnode != -1 && !match) match = node.subnodes[subnode].match(BONUS_REGEX);
    if (match) bonusPoint = match[1].toLowerCase();

    if (!isSelected) {
      dispatch({
        type: 'select',
        node: { subnode, bonusPoint, ...props },
      });
    } else {
      if (subnode != -1 && subnode != selectedSubnode) {
        let prevBonusPoint;
        let match = node.subnodes[selectedSubnode].match(BONUS_REGEX);
        if (match) prevBonusPoint = match[1].toLowerCase();

        dispatch({
          type: 'reselect',
          node: { subnode, bonusPoint, prevBonusPoint, ...props },
        });
      } else {
        dispatch({
          type: 'deselect',
          node: { bonusPoint, ...props },
        });
      }
    }
  }

  const tooltip = [];
  if (node.description.trim()) tooltip.push(node.description.trim());

  if (node.subnodes && node.subnodes.length) {
    const subnodes = [];
    for (let i = 0; i < node.subnodes.length; i++) {
      tooltip.push(`${i + 1}) ${node.subnodes[i].trim()}`);
      subnodes.push(
        <div
          className={classNames('subnode', { selected: isSelected && selectedSubnode == i })}
          onClick={onClick.bind(this, i)}
        >
          {i + 1}
        </div>
      );
    }

    return (
      <div
        data-tip={tooltip.join('<br />').replace(/\n/g, '<br/>')}
        className={classNames('node subnodes', { selected: isSelected, selectable: isSelectable })}
      >
        {subnodes}
      </div>
    );
  }

  return (
    <div
      data-tip={tooltip.join('<br />').replace(/\n/g, '<br/>')}
      className={classNames('node', { selected: isSelected, selectable: isSelectable })}
      onClick={onClick.bind(this, -1)}
    ></div>
  );
}
