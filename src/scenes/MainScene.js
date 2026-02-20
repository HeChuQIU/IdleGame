import { NumberFormat } from '../core/NumberFormat.js';
import { SaveSystem } from '../core/SaveSystem.js';
import { GENERATORS } from '../data/generators.js';
import { EconomySystem } from '../systems/EconomySystem.js';
import { PrestigeSystem } from '../systems/PrestigeSystem.js';
import { getRadialPositions } from '../ui/RadialLayout.js';
import { createGeneratorNode } from '../ui/GeneratorNode.js';

const DEFAULT_STATE = {
  version: '0.1.0',
  currencies: { chronon: 0, crystal: 0, shard: 0, anomalyData: 0 },
  generators: [0, 0, 0, 0, 0],
  generatorMultipliers: [1, 1, 1, 1, 1],
  globalMultiplier: 1,
  costMultiplier: 1,
  upgrades: [],
  tech: { p1: [], p2: [], dungeon: [] },
  prestige: { p1Count: 0, p2Count: 0, lifetimeChronon: 0, lifetimeCrystal: 0, p1Multiplier: 1, p2Multiplier: 1 },
  settings: { autoBuy: false, numberFormat: 'scientific' },
  lastCps: 0,
  lastTimestamp: 0
};
const AUTOSAVE_INTERVAL_MS = 10000;
const FONT_FAMILY = '"Noto Sans SC", "PingFang SC", "Microsoft YaHei", "Hiragino Sans GB", "WenQuanYi Micro Hei", Arial, sans-serif';

export class MainScene extends Phaser.Scene {
  constructor() {
    super('MainScene');
  }

  create() {
    this.state = SaveSystem.load(DEFAULT_STATE);
    this.economy = new EconomySystem(this.state, GENERATORS);
    this.prestige = new PrestigeSystem(this.state);
    this.tempRunMultiplier = 1;

    const offlineGain = SaveSystem.getOfflineGain(this.state.lastCps || 0, this.state.lastTimestamp || 0);
    if (offlineGain > 0) {
      this.state.currencies.chronon += offlineGain;
      this.state.prestige.lifetimeChronon += offlineGain;
      this.add.text(640, 80, `离线收益 +${NumberFormat.format(offlineGain)}`, { fontFamily: FONT_FAMILY, fontSize: '24px', color: '#6fffe9' }).setOrigin(0.5);
    }

    this.core = this.add.circle(640, 360, 110, 0x081a37, 1).setStrokeStyle(3, 0x78d5ff);
    this.coreText = this.add.text(640, 360, '', { fontFamily: FONT_FAMILY, fontSize: '22px', align: 'center', color: '#d8ecff' }).setOrigin(0.5);

    this.currencyText = this.add.text(640, 28, '', { fontFamily: FONT_FAMILY, fontSize: '20px', color: '#d8ecff' }).setOrigin(0.5, 0);
    this.logText = this.add.text(1020, 120, '日志', { fontFamily: FONT_FAMILY, fontSize: '16px', color: '#9bc6ff', wordWrap: { width: 230 } });

    const positions = getRadialPositions(640, 360, 230, GENERATORS.length);
    this.nodes = positions.map((p, i) => createGeneratorNode(this, p.x, p.y, () => this.buyGenerator(i)));

    this.createButtons();
    this.time.addEvent({ delay: AUTOSAVE_INTERVAL_MS, loop: true, callback: () => SaveSystem.save(this.state) });
  }

  createButtons() {
    this.p1Button = this.createTextButton(160, 620, '时间回溯', () => {
      const gain = this.prestige.doP1();
      if (gain > 0) this.log(`执行P1 +${gain} TC`);
    });
    this.p2Button = this.createTextButton(360, 620, '宇宙跃迁', () => {
      const gain = this.prestige.doP2();
      if (gain > 0) this.log(`执行P2 +${gain} DS`);
    });
    this.dungeonButton = this.createTextButton(560, 620, '进入裂隙', () => {
      this.scene.pause();
      this.scene.launch('DungeonScene', { main: this });
    });

    this.createTextButton(920, 600, 'P1科技 +10%产量 (10TC)', () => {
      if (this.state.currencies.crystal >= 10 && !this.state.tech.p1.includes('amp')) {
        this.state.currencies.crystal -= 10;
        this.state.globalMultiplier *= 1.1;
        this.state.tech.p1.push('amp');
      }
    });
    this.createTextButton(920, 640, 'P2科技 +5%P1收益 (5DS)', () => {
      if (this.state.currencies.shard >= 5 && !this.state.tech.p2.includes('p1plus')) {
        this.state.currencies.shard -= 5;
        this.state.prestige.p1Multiplier *= 1.05;
        this.state.tech.p2.push('p1plus');
      }
    });
    this.createTextButton(920, 680, '副本科技 +10秒 (20AD)', () => {
      if (this.state.currencies.anomalyData >= 20) {
        this.state.currencies.anomalyData -= 20;
        this.state.tech.dungeon.push('time+');
      }
    });
  }

  createTextButton(x, y, label, onClick) {
    const bg = this.add.rectangle(x, y, 220, 32, 0x153366, 0.95).setStrokeStyle(1, 0x6cc9ff);
    const text = this.add.text(x, y, label, { fontFamily: FONT_FAMILY, fontSize: '14px', color: '#d8ecff' }).setOrigin(0.5);
    const zone = this.add.zone(x, y, 220, 32).setInteractive({ useHandCursor: true });
    zone.on('pointerdown', onClick);
    return { bg, text, zone };
  }

  buyGenerator(index) {
    if (!this.economy.buyGenerator(index)) return;
    this.log(`购买 ${GENERATORS[index].name}`);
    const pulse = this.add.circle(640, 360, 20, 0x88e4ff, 0.8).setBlendMode(Phaser.BlendModes.ADD);
    this.tweens.add({ targets: pulse, radius: 130, alpha: 0, duration: 380, ease: 'Cubic.Out', onComplete: () => pulse.destroy() });
  }

  applyDungeonReward(anomalyData, tempMultiplierBonus = 0) {
    this.state.currencies.anomalyData += anomalyData;
    this.tempRunMultiplier = 1 + tempMultiplierBonus;
    this.log(`副本结算 +${anomalyData} AD`);
  }

  log(msg) {
    this.logText.setText(`日志\n${msg}`);
  }

  update(_, delta) {
    const dt = delta / 1000;
    this.economy.tick(dt, this.tempRunMultiplier);
    const cps = this.economy.getCps(this.tempRunMultiplier);

    this.currencyText.setText(`CHR ${NumberFormat.format(this.state.currencies.chronon)} | TC ${this.state.currencies.crystal} | DS ${this.state.currencies.shard} | AD ${this.state.currencies.anomalyData}`);
    this.coreText.setText(`时间裂隙\n${NumberFormat.format(this.state.currencies.chronon)}\n${NumberFormat.format(cps)}/s`);

    this.nodes.forEach((node, i) => node.updateData({
      name: GENERATORS[i].name,
      owned: this.state.generators[i],
      cost: this.economy.getGeneratorCost(i),
      affordable: this.state.currencies.chronon >= this.economy.getGeneratorCost(i)
    }));

    const p1Gain = this.prestige.getP1Gain();
    const p2Gain = this.prestige.getP2Gain();
    this.p1Button.text.setText(`时间回溯 +${p1Gain}TC`);
    this.p2Button.text.setText(`宇宙跃迁 +${p2Gain}DS`);
  }

  shutdown() {
    SaveSystem.save(this.state);
  }
}
