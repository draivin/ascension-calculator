import React, { useContext } from 'react';
import { CalculatorContext } from '../state/CalculatorContext';
import { EMBODIMENT_NAMES, CLUSTERS } from '../dataset';
import { SearchBox } from './SearchBox';

const VALUE_MODIFIER_REGEX = /^\+([\d.]+)(.*)/;

const categories = [
  {
    header: 'Attributes',
    regex: /^\+\d+(% invested)? (strength|constitution|power|finesse|wits|memory)\./,
  },
  {
    header: 'Skills',
    regex: /^\+\d+ (ranged|single-handed|two-handed|leadership|perseverance|retribution|aerotheurge|geomancer|huntsman|hydrosophist|necromancer|polymorph|pyrokinetic|scoundrel|summoning|warfare|sourcery)\./,
  },
  {
    header: 'Stats',
    regex: /^\+[\d.]+%? (initiative|critical chance|accuracy|damage|movement speed|lifesteal|maximum vitality|dodge chance)\./,
  },
  {
    header: 'Resistances',
    regex: /^\+\d+% ((water|fire|air|earth|poison|physical|piercing) resistance|to elemental resistances)\./,
  },
  {
    header: 'Summons',
    regex: /^\+[\d.]+%? summon \w+( \w+)?\./,
  },
  {
    header: 'Embodiments',
    regex: /^\+\d+ (force|entropy|form|inertia|life)\./,
  },
  {
    header: 'Predator',
    regex: /predator/,
  },
  {
    header: 'Voracity',
    regex: /voracity/,
  },
  {
    header: 'Elementalist',
    regex: /elementalist/,
  },
];

function collectModifiers(state) {
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

    const node = CLUSTERS[cluster].nodes[index];
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
    modifiers.push(`+${Math.round(value * 10) / 10}${description}`);
  }

  modifiers.push(...textModifiers);

  return modifiers;
}

export function Overview() {
  const { state } = useContext(CalculatorContext);

  const points = [];
  for (let embodiment of EMBODIMENT_NAMES) {
    points.push(<div className={`point ${embodiment}`}>{state.points[embodiment]}</div>);
  }

  const modifiers = collectModifiers(state);
  let modifiersByCategory = categories.map((c) => []);
  const otherModifiers = [];

  for (let modifier of modifiers) {
    let hasCategory = false;

    for (let i = 0; i < categories.length; i++) {
      const category = categories[i];

      if (modifier.toLowerCase().match(category.regex)) {
        hasCategory = true;
        modifiersByCategory[i].push(modifier);
        break;
      }
    }

    if (!hasCategory) {
      otherModifiers.push(modifier);
    }
  }

  const categoryElements = [];
  for (let i = 0; i < categories.length; i++) {
    const category = categories[i];

    if (modifiersByCategory[i].length) {
      categoryElements.push(
        <div className="category">
          <div className="category-header">{category.header}:</div>
          {modifiersByCategory[i].map((m) => (
            <div>{m}</div>
          ))}
        </div>
      );
    }
  }

  if (otherModifiers.length) {
    categoryElements.push(
      <div className="category">
        <div className="category-header">Other bonuses:</div>
        {otherModifiers.map((m) => (
          <div>{m}</div>
        ))}
      </div>
    );
  }

  return (
    <div className="overview-container">
      <div className="overview">
        <div className="total-points points">
          <div className="points-name">Available Ascension:</div> {points}
        </div>
        <div className="points-used">Points used: {Object.keys(state.nodes).length}</div>
        <div className="search-header">Search:</div>
        <SearchBox />

        <div className="description">
          <div className="description-title">Bonuses overview:</div>
          {categoryElements}
        </div>
      </div>
    </div>
  );
}
