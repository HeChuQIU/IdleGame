const SAVE_KEY = 'time-rift-save-v0.1.0';
const MAX_OFFLINE_SECONDS = 28800;

export class SaveSystem {
  static save(state) {
    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify({ ...state, lastTimestamp: Date.now() }));
    } catch (_) {}
  }

  static load(defaultState) {
    try {
      const raw = localStorage.getItem(SAVE_KEY);
      if (!raw) return defaultState;
      const data = JSON.parse(raw);
      return {
        ...defaultState,
        ...data,
        currencies: { ...defaultState.currencies, ...data.currencies },
        prestige: { ...defaultState.prestige, ...data.prestige },
        settings: { ...defaultState.settings, ...data.settings },
        tech: { ...defaultState.tech, ...data.tech }
      };
    } catch (_) {
      return defaultState;
    }
  }

  static getOfflineGain(lastCps, lastTimestamp) {
    if (!lastTimestamp || lastCps <= 0) return 0;
    const elapsed = Math.min((Date.now() - lastTimestamp) / 1000, MAX_OFFLINE_SECONDS);
    return Math.max(0, elapsed * lastCps * 0.7);
  }
}
