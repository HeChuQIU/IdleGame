export class EconomySystem {
  constructor(state, generators) {
    this.state = state;
    this.generators = generators;
  }

  getGeneratorCost(index) {
    const gen = this.generators[index];
    const count = this.state.generators[index] || 0;
    return gen.baseCost * Math.pow(gen.scale, count) * this.state.costMultiplier;
  }

  buyGenerator(index) {
    const cost = this.getGeneratorCost(index);
    if (this.state.currencies.chronon < cost) return false;
    this.state.currencies.chronon -= cost;
    this.state.generators[index] += 1;
    return true;
  }

  getBaseCps() {
    return this.generators.reduce((sum, gen, i) => sum + this.state.generators[i] * gen.baseProduction * (this.state.generatorMultipliers[i] || 1), 0);
  }

  getCps(tempMultiplier = 1) {
    return this.getBaseCps() * this.state.globalMultiplier * tempMultiplier;
  }

  tick(deltaSec, tempMultiplier = 1) {
    const cps = this.getCps(tempMultiplier);
    const gain = cps * deltaSec;
    this.state.currencies.chronon += gain;
    this.state.prestige.lifetimeChronon += gain;
    this.state.lastCps = cps;
  }
}
