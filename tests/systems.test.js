import test from 'node:test';
import assert from 'node:assert/strict';

import { EconomySystem } from '../src/systems/EconomySystem.js';
import { PrestigeSystem } from '../src/systems/PrestigeSystem.js';
import { DungeonSystem } from '../src/systems/DungeonSystem.js';

test('economy cost and cps formulas work', () => {
  const state = {
    currencies: { chronon: 1000 },
    generators: [1, 0, 0, 0, 0],
    generatorMultipliers: [1, 1, 1, 1, 1],
    globalMultiplier: 2,
    costMultiplier: 1,
    prestige: { lifetimeChronon: 0 }
  };
  const gens = [{ baseCost: 10, scale: 1.15, baseProduction: 1 }];
  const economy = new EconomySystem(state, gens);
  assert.equal(Math.round(economy.getGeneratorCost(0) * 100) / 100, 11.5);
  assert.equal(economy.getCps(), 2);
});

test('prestige gain formulas match design', () => {
  const state = {
    currencies: { chronon: 0, crystal: 0, shard: 0 },
    generators: [1, 1, 1, 1, 1],
    upgrades: ['x'],
    tech: { p1: ['a'] },
    prestige: { lifetimeChronon: 4e6, lifetimeCrystal: 1e5, p1Multiplier: 1, p2Multiplier: 1, p1Count: 0, p2Count: 0 }
  };
  const p = new PrestigeSystem(state);
  assert.equal(p.getP1Gain(), 2);
  assert.equal(p.getP2Gain(), 3);
});

test('dungeon anomaly conversion works', () => {
  const run = { timeLeft: 120, elapsed: 0, draftIndex: 0, baseRate: 1000, outputMultiplier: 0, tempoMultiplier: 0, comboMultiplier: 0, difficultyFactor: 1, totalGenerated: 0 };
  const d = new DungeonSystem(run);
  d.tick(100);
  assert.equal(Math.floor(d.getRunScore()), 100000);
  assert.equal(d.getAnomalyGain(), 1);
});
