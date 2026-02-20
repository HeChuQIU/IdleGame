export const NumberFormat = {
  format(value) {
    if (!Number.isFinite(value)) return '0';
    if (Math.abs(value) < 1e6) return value.toLocaleString('en-US', { maximumFractionDigits: 2 });
    if (Math.abs(value) < 1e15) {
      const units = ['M', 'B', 'T'];
      let n = value;
      let idx = -1;
      while (Math.abs(n) >= 1e3 && idx < units.length - 1) {
        n /= 1e3;
        idx += 1;
      }
      return `${n.toFixed(2)}${units[idx]}`;
    }
    return value.toExponential(2);
  }
};
