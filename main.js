import { GameConfig } from './src/core/GameConfig.js';
import { BootScene } from './src/scenes/BootScene.js';
import { MainScene } from './src/scenes/MainScene.js';
import { DungeonScene } from './src/scenes/DungeonScene.js';
import { UIScene } from './src/scenes/UIScene.js';

new Phaser.Game({
  ...GameConfig,
  parent: 'game-container',
  scene: [BootScene, MainScene, DungeonScene, UIScene]
});
