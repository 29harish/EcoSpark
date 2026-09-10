import Phaser from 'phaser';
import { COLORS } from '../config';

function bake(
  scene: Phaser.Scene,
  key: string,
  width: number,
  height: number,
  draw: (g: Phaser.GameObjects.Graphics) => void,
): void {
  if (scene.textures.exists(key)) return;
  const g = scene.add.graphics();
  g.setVisible(false);
  draw(g);
  g.generateTexture(key, width, height);
  g.destroy();
}

export function createGardenTextures(scene: Phaser.Scene): void {
  bake(scene, 'player', 40, 56, (g) => {
    g.fillStyle(COLORS.playerPants, 1);
    g.fillRoundedRect(10, 32, 20, 20, 5);
    g.fillStyle(COLORS.playerShirt, 1);
    g.fillRoundedRect(8, 18, 24, 20, 7);
    g.fillStyle(COLORS.playerSkin, 1);
    g.fillCircle(20, 14, 10);
    g.fillStyle(COLORS.canopy, 1);
    g.fillEllipse(20, 8, 22, 10);
    g.fillStyle(0xffffff, 0.9);
    g.fillCircle(17, 14, 2);
    g.fillCircle(24, 14, 2);
  });

  bake(scene, 'tree', 96, 128, (g) => {
    g.fillStyle(COLORS.bark, 1);
    g.fillRoundedRect(40, 70, 16, 54, 4);
    g.fillStyle(COLORS.canopy, 1);
    g.fillCircle(48, 52, 38);
    g.fillStyle(COLORS.canopyLite, 1);
    g.fillCircle(32, 44, 26);
    g.fillCircle(64, 40, 24);
    g.fillCircle(48, 28, 22);
  });

  bake(scene, 'bush', 64, 44, (g) => {
    g.fillStyle(COLORS.bush, 1);
    g.fillCircle(20, 26, 16);
    g.fillCircle(44, 26, 16);
    g.fillCircle(32, 16, 18);
    g.fillStyle(COLORS.canopyLite, 0.7);
    g.fillCircle(28, 14, 8);
  });

  bake(scene, 'flower-pink', 28, 36, (g) => {
    g.fillStyle(COLORS.canopyLite, 1);
    g.fillRect(12, 18, 4, 16);
    g.fillStyle(COLORS.flowerPink, 1);
    g.fillCircle(10, 14, 6);
    g.fillCircle(18, 14, 6);
    g.fillCircle(14, 8, 6);
    g.fillCircle(14, 16, 6);
    g.fillStyle(COLORS.flowerGold, 1);
    g.fillCircle(14, 14, 3);
  });

  bake(scene, 'flower-gold', 28, 36, (g) => {
    g.fillStyle(COLORS.canopyLite, 1);
    g.fillRect(12, 18, 4, 16);
    g.fillStyle(COLORS.flowerGold, 1);
    g.fillCircle(10, 14, 6);
    g.fillCircle(18, 14, 6);
    g.fillCircle(14, 8, 6);
    g.fillCircle(14, 16, 6);
    g.fillStyle(0xfff3c4, 1);
    g.fillCircle(14, 14, 3);
  });

  bake(scene, 'flower-lav', 28, 36, (g) => {
    g.fillStyle(COLORS.canopyLite, 1);
    g.fillRect(12, 18, 4, 16);
    g.fillStyle(COLORS.flowerLav, 1);
    g.fillCircle(10, 14, 6);
    g.fillCircle(18, 14, 6);
    g.fillCircle(14, 8, 6);
    g.fillCircle(14, 16, 6);
    g.fillStyle(COLORS.cream, 1);
    g.fillCircle(14, 14, 3);
  });

  bake(scene, 'rock', 48, 32, (g) => {
    g.fillStyle(COLORS.rockShadow, 1);
    g.fillEllipse(24, 20, 40, 18);
    g.fillStyle(COLORS.rock, 1);
    g.fillEllipse(24, 16, 36, 18);
    g.fillStyle(0xc5d4d8, 0.8);
    g.fillEllipse(18, 12, 10, 5);
  });

  bake(scene, 'pond', 260, 160, (g) => {
    g.fillStyle(COLORS.waterDeep, 1);
    g.fillEllipse(130, 84, 240, 140);
    g.fillStyle(COLORS.water, 1);
    g.fillEllipse(130, 80, 220, 124);
    g.fillStyle(COLORS.waterHighlight, 0.45);
    g.fillEllipse(100, 60, 90, 36);
    g.fillStyle(COLORS.canopyLite, 0.55);
    g.fillEllipse(40, 90, 28, 14);
    g.fillEllipse(220, 100, 24, 12);
  });

  bake(scene, 'house', 200, 180, (g) => {
    g.fillStyle(COLORS.houseRoof, 1);
    g.fillTriangle(20, 78, 100, 18, 180, 78);
    g.fillStyle(COLORS.houseWall, 1);
    g.fillRoundedRect(40, 76, 120, 88, 6);
    g.fillStyle(COLORS.houseTrim, 1);
    g.fillRect(88, 116, 28, 48);
    g.fillStyle(0xabe8f0, 1);
    g.fillRect(54, 96, 22, 22);
    g.fillRect(124, 96, 22, 22);
    g.fillStyle(COLORS.wood, 1);
    g.fillRect(96, 128, 6, 12);
    g.fillStyle(COLORS.canopy, 1);
    g.fillCircle(168, 128, 18);
    g.fillCircle(34, 132, 14);
  });

  bake(scene, 'seed-oak', 32, 32, (g) => {
    g.fillStyle(0xf4ecd9, 1);
    g.fillRoundedRect(2, 2, 28, 28, 6);
    g.fillStyle(COLORS.bark, 1);
    g.fillEllipse(16, 18, 16, 12);
    g.fillStyle(COLORS.canopy, 1);
    g.fillEllipse(16, 12, 14, 8);
  });

  bake(scene, 'seed-wildflower', 32, 32, (g) => {
    g.fillStyle(0xf4ecd9, 1);
    g.fillRoundedRect(2, 2, 28, 28, 6);
    g.fillStyle(COLORS.flowerPink, 1);
    g.fillCircle(16, 16, 8);
    g.fillStyle(COLORS.flowerGold, 1);
    g.fillCircle(16, 16, 3);
  });

  bake(scene, 'seed-fern', 32, 32, (g) => {
    g.fillStyle(0xf4ecd9, 1);
    g.fillRoundedRect(2, 2, 28, 28, 6);
    g.fillStyle(COLORS.canopyLite, 1);
    g.fillTriangle(16, 6, 8, 24, 24, 24);
    g.fillStyle(COLORS.canopy, 1);
    g.fillRect(15, 16, 2, 10);
  });

  bake(scene, 'plant-seed', 24, 20, (g) => {
    g.fillStyle(COLORS.bark, 1);
    g.fillEllipse(12, 12, 14, 10);
  });

  bake(scene, 'plant-sprout', 28, 36, (g) => {
    g.fillStyle(COLORS.canopyLite, 1);
    g.fillRect(12, 16, 4, 18);
    g.fillEllipse(8, 16, 12, 8);
    g.fillEllipse(20, 14, 12, 8);
  });

  bake(scene, 'plant-young', 40, 56, (g) => {
    g.fillStyle(COLORS.bark, 1);
    g.fillRect(18, 32, 5, 22);
    g.fillStyle(COLORS.canopyLite, 1);
    g.fillCircle(20, 24, 16);
    g.fillCircle(12, 20, 10);
    g.fillCircle(28, 18, 10);
  });

  bake(scene, 'plant-mature', 64, 80, (g) => {
    g.fillStyle(COLORS.bark, 1);
    g.fillRoundedRect(28, 42, 8, 36, 3);
    g.fillStyle(COLORS.canopy, 1);
    g.fillCircle(32, 32, 26);
    g.fillStyle(COLORS.canopyLite, 1);
    g.fillCircle(20, 26, 16);
    g.fillCircle(44, 24, 16);
    g.fillCircle(32, 16, 14);
  });

  bake(scene, 'coin', 28, 28, (g) => {
    g.fillStyle(0xd27706, 1);
    g.fillCircle(14, 14, 13);
    g.fillStyle(COLORS.gold, 1);
    g.fillCircle(14, 14, 11);
    g.fillStyle(0xfff3c4, 1);
    g.fillCircle(14, 14, 6);
  });
}
