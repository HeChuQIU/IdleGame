export function getRadialPositions(cx, cy, radius, count) {
  const step = (Math.PI * 2) / count;
  return Array.from({ length: count }, (_, i) => ({
    x: cx + Math.cos(step * i - Math.PI / 2) * radius,
    y: cy + Math.sin(step * i - Math.PI / 2) * radius
  }));
}
