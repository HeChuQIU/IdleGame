import { BUFFS } from '../data/buffs.js';

const THRESHOLDS = [2, 4, 6];
const shuffle = (list) => {
  const arr = [...list];
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

export class BuffSystem {
  constructor(runState) {
    this.runState = runState;
  }

  getDraftOptions() {
    const pool = shuffle(BUFFS);
    return pool.slice(0, 3);
  }

  applyBuff(buff) {
    this.runState.buffs.push(buff);
    this.runState.outputMultiplier += buff.effect.outputMult || 0;
    this.runState.tempoMultiplier += buff.effect.tempoMult || 0;
    this.runState.comboMultiplier += buff.effect.comboMult || 0;
    this.runState.timeLeft += buff.effect.timeBonus || 0;

    buff.tags.forEach((tag) => {
      this.runState.tagCount[tag] = (this.runState.tagCount[tag] || 0) + 1;
      this.applySynergy(tag);
    });
  }

  applySynergy(tag) {
    const count = this.runState.tagCount[tag];
    if (!THRESHOLDS.includes(count)) return;
    const bonus = count === 2 ? 0.15 : count === 4 ? 0.25 : 0.4;
    this.runState.comboMultiplier += bonus;
  }
}
