export class PrestigeSystem {
  constructor(state) {
    this.state = state;
  }

  getP1Gain() {
    return Math.floor(Math.pow(this.state.prestige.lifetimeChronon / 1e6, 0.5) * this.state.prestige.p1Multiplier);
  }

  getP2Gain() {
    return Math.floor(Math.pow(this.state.prestige.lifetimeCrystal / 1e4, 0.6) * this.state.prestige.p2Multiplier);
  }

  doP1() {
    const gain = this.getP1Gain();
    if (gain <= 0) return 0;
    this.state.currencies.crystal += gain;
    this.state.prestige.lifetimeCrystal += gain;
    this.state.prestige.p1Count += 1;
    this.state.currencies.chronon = 0;
    this.state.generators = [0, 0, 0, 0, 0];
    this.state.upgrades = [];
    return gain;
  }

  doP2() {
    const gain = this.getP2Gain();
    if (gain <= 0) return 0;
    this.state.currencies.shard += gain;
    this.state.prestige.p2Count += 1;
    this.state.currencies.chronon = 0;
    this.state.currencies.crystal = 0;
    this.state.generators = [0, 0, 0, 0, 0];
    this.state.upgrades = [];
    this.state.tech.p1 = [];
    return gain;
  }
}
