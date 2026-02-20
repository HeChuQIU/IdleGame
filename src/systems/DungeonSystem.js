export class DungeonSystem {
  constructor(runState) {
    this.runState = runState;
  }

  tick(delta) {
    this.runState.timeLeft -= delta;
    this.runState.elapsed += delta;
    this.runState.totalGenerated += this.runState.baseRate * (1 + this.runState.outputMultiplier) * (1 + this.runState.tempoMultiplier) * delta;
  }

  shouldDraft() {
    return Math.floor(this.runState.elapsed / 15) > this.runState.draftIndex;
  }

  markDrafted() {
    this.runState.draftIndex += 1;
  }

  getRunScore() {
    return this.runState.totalGenerated * (1 + this.runState.comboMultiplier) * this.runState.difficultyFactor;
  }

  getAnomalyGain() {
    return Math.floor(Math.pow(this.getRunScore() / 1e5, 0.65));
  }
}
