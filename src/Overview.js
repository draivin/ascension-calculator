import React, { useContext } from 'react';
import { CalculatorContext, embodimentNames, clusters } from './CalculatorContext';

const VALUE_MODIFIER_REGEX = /^\+(\d+)(.*)/;

export function Overview() {
  const calculator = useContext(CalculatorContext);
  const state = calculator.state;

  const points = [];
  for (let embodiment of embodimentNames) {
    points.push(<div className={`point ${embodiment}`}>{calculator.state.points[embodiment]}</div>);
  }

  const valueModifiers = {};
  const textModifiers = [];

  function addModifier(line) {
    line
      .split('\n» ')
      .map((s) => s.trim())
      .forEach((modifier) => {
        let match = modifier.match(VALUE_MODIFIER_REGEX);
        if (match) {
          const description = match[2];
          const value = Number(match[1]);
          valueModifiers[description] = (valueModifiers[description] || 0) + value;
        } else {
          textModifiers.push(modifier);
        }
      });
  }

  for (let nodeId in state.nodes) {
    let [cluster, index] = nodeId.split('.');

    const node = clusters[cluster].nodes[index];
    const subnode = state.nodes[nodeId];

    const modifier = node.description.trim();

    if (modifier) addModifier(modifier);
    if (subnode != -1) {
      addModifier(node.subnodes[subnode]);
    }
  }

  const modifiers = [];

  for (let description of Object.keys(valueModifiers)) {
    let value = valueModifiers[description];
    modifiers.push(`+${value}${description}`);
  }

  modifiers.push(...textModifiers);

  return (
    <div className="overview">
      <div className="total-points points">
        <div className="points-name">Available Ascension:</div> {points}
      </div>
      <div className="points-used">Points used: {Object.keys(state.nodes).length}</div>

      <div className="description">
        <div className="description-title">Bonuses overview:</div>
        {modifiers.map((m) => (
          <div>{m}</div>
        ))}
      </div>
    </div>
  );
}
