import Phaser from 'phaser';
import { PLANT_STAGE_MS } from '../config';
import type { PlantStage, SeedId } from '../types';

const STAGE_ORDER: PlantStage[] = ['seed', 'sprout', 'young', 'mature'];
const STAGE_TEXTURE: Record<PlantStage, string> = {
  seed: 'plant-seed',
  sprout: 'plant-sprout',
  young: 'plant-young',
  mature: 'plant-mature',
};

export class Plant {
  stage: PlantStage = 'seed';
  readonly sprite: Phaser.GameObjects.Image;
  private elapsed = 0;

  constructor(
    scene: Phaser.Scene,
    readonly x: number,
    readonly y: number,
    readonly seedId: SeedId,
  ) {
    this.sprite = scene.add.image(x, y, STAGE_TEXTURE.seed);
    this.sprite.setOrigin(0.5, 0.9);
    this.sprite.setDepth(y);
    this.sprite.setScale(0.7);
    scene.tweens.add({
      targets: this.sprite,
      scale: 1,
      duration: 280,
      ease: 'Back.easeOut',
    });
  }

  update(delta: number, scene: Phaser.Scene): void {
    if (this.stage === 'mature') return;

    this.elapsed += delta;
    if (this.elapsed < PLANT_STAGE_MS) return;

    this.elapsed = 0;
    const next = STAGE_ORDER[STAGE_ORDER.indexOf(this.stage) + 1];
    if (!next) return;
    this.stage = next;
    this.sprite.setTexture(STAGE_TEXTURE[next]);
    this.sprite.setScale(0.85);
    scene.tweens.add({
      targets: this.sprite,
      scale: 1,
      duration: 320,
      ease: 'Sine.easeOut',
    });
  }
}
