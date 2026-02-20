import { NumberFormat } from '../core/NumberFormat.js';
import { DungeonSystem } from '../systems/DungeonSystem.js';
import { BuffSystem } from '../systems/BuffSystem.js';

const MAX_COMBO_BONUS = 0.5;
const COMBO_BONUS_RATIO = 0.2;

export class DungeonScene extends Phaser.Scene {
  constructor() {
    super('DungeonScene');
  }

  create(data) {
    this.main = data.main;
    const extraTime = this.main.state.tech.dungeon.filter((x) => x === 'time+').length * 10;
    this.runState = {
      timeLeft: 120 + extraTime,
      elapsed: 0,
      draftIndex: 0,
      baseRate: 1000,
      outputMultiplier: 0,
      tempoMultiplier: 0,
      comboMultiplier: 0,
      difficultyFactor: 1,
      totalGenerated: 0,
      buffs: [],
      tagCount: { QUANTUM: 0, CAUSAL: 0, ENTROPY: 0, LOOP: 0 }
    };
    this.system = new DungeonSystem(this.runState);
    this.buffSystem = new BuffSystem(this.runState);
    this.pausedForDraft = false;

    this.bg = this.add.rectangle(640, 360, 1280, 720, 0x130b26, 1);
    this.vignette = this.add.rectangle(640, 360, 1280, 720, 0x330000, 0);
    this.title = this.add.text(640, 40, '时间裂隙冲刺', { fontSize: '30px', color: '#d8ecff' }).setOrigin(0.5);
    this.timerText = this.add.text(60, 60, '', { fontSize: '28px', color: '#d8ecff' });
    this.scoreText = this.add.text(60, 100, '', { fontSize: '24px', color: '#9df7ff' });
    this.buffText = this.add.text(900, 60, 'Buff:\n', { fontSize: '16px', color: '#d8ecff', wordWrap: { width: 330 } });
    this.add.text(640, 640, '每15秒触发一次3选1 Buff', { fontSize: '18px', color: '#9bc6ff' }).setOrigin(0.5);
  }

  update(_, delta) {
    const dt = delta / 1000;
    if (!this.pausedForDraft) {
      this.system.tick(dt);

      if (this.system.shouldDraft() && this.runState.timeLeft > 0) {
        this.pausedForDraft = true;
        this.system.markDrafted();
        this.openDraft();
      }
    }

    if (this.runState.timeLeft <= 20) {
      this.vignette.alpha = 0.15 + Math.abs(Math.sin(this.time.now / 100)) * 0.2;
      this.bg.setFillStyle(0x220a14, 1);
    }

    this.timerText.setText(`剩余: ${Math.max(0, this.runState.timeLeft).toFixed(1)}s`);
    this.scoreText.setText(`RunScore: ${NumberFormat.format(this.system.getRunScore())}`);
    this.buffText.setText(`Buff:\n${this.runState.buffs.map((b) => `- ${b.name}`).join('\n') || '无'}`);

    if (this.runState.timeLeft <= 0) this.finishRun();
  }

  openDraft() {
    const options = this.buffSystem.getDraftOptions();
    this.draftLayer = this.add.container(640, 360);
    const panel = this.add.rectangle(0, 0, 760, 260, 0x081a37, 0.98).setStrokeStyle(2, 0x78d5ff);
    const title = this.add.text(0, -95, '选择一个 Buff', { fontSize: '24px', color: '#d8ecff' }).setOrigin(0.5);
    this.draftLayer.add([panel, title]);

    options.forEach((buff, i) => {
      const x = (i - 1) * 240;
      const rect = this.add.rectangle(x, 20, 220, 150, 0x153366, 0.95).setStrokeStyle(1, 0x6cc9ff);
      const txt = this.add.text(x, 20, `${buff.name}\n[${buff.tags.join(',')}]`, { fontSize: '16px', align: 'center', color: '#d8ecff', wordWrap: { width: 200 } }).setOrigin(0.5);
      const hit = this.add.zone(x, 20, 220, 150).setInteractive({ useHandCursor: true });
      hit.on('pointerdown', () => {
        this.buffSystem.applyBuff(buff);
        this.pausedForDraft = false;
        this.draftLayer.destroy(true);
      });
      this.draftLayer.add([rect, txt, hit]);
    });
  }

  finishRun() {
    if (this.finished) return;
    this.finished = true;
    const anomalyData = this.system.getAnomalyGain();
    const bonus = Math.min(MAX_COMBO_BONUS, this.runState.comboMultiplier * COMBO_BONUS_RATIO);
    this.main.applyDungeonReward(anomalyData, bonus);

    const panel = this.add.rectangle(640, 360, 600, 260, 0x081a37, 0.99).setStrokeStyle(2, 0x78d5ff);
    const text = this.add.text(640, 320, `副本结束\n得分: ${NumberFormat.format(this.system.getRunScore())}\n获得: ${anomalyData} AD`, { fontSize: '24px', align: 'center', color: '#d8ecff' }).setOrigin(0.5);
    const btn = this.add.rectangle(640, 450, 200, 50, 0x153366, 0.95).setStrokeStyle(1, 0x6cc9ff).setInteractive({ useHandCursor: true });
    const btnText = this.add.text(640, 450, '返回主界面', { fontSize: '20px', color: '#d8ecff' }).setOrigin(0.5);
    btn.on('pointerdown', () => {
      this.scene.stop();
      this.main.scene.resume();
    });
    this.add.existing(panel);
    this.add.existing(text);
    this.add.existing(btn);
    this.add.existing(btnText);
  }
}
