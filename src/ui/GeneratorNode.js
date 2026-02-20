import { NumberFormat } from '../core/NumberFormat.js';

export function createGeneratorNode(scene, x, y, onBuy) {
  const bg = scene.add.circle(0, 0, 90, 0x102044, 0.95).setStrokeStyle(2, 0x36a2ff, 0.9);
  const text = scene.add.text(0, 0, '', { fontSize: '16px', align: 'center', color: '#d8ecff' }).setOrigin(0.5);
  const container = scene.add.container(x, y, [bg, text]).setSize(180, 180).setInteractive({ useHandCursor: true });
  container.on('pointerdown', onBuy);
  container.updateData = ({ name, owned, cost, affordable }) => {
    bg.setFillStyle(affordable ? 0x153366 : 0x2d2d2d, 0.95);
    text.setText(`${name}\nLv ${owned}\nCost ${NumberFormat.format(cost)}`);
  };
  return container;
}
