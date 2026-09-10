import Phaser from 'phaser';
import { CAMERA_LERP, COLORS, SPAWN, WORLD_HEIGHT, WORLD_WIDTH } from '../config';
import { Player } from '../entities/Player';
import { createGardenTextures } from '../graphics/TextureFactory';
import { Inventory } from '../systems/Inventory';
import { PlantingSystem } from '../systems/PlantingSystem';
import { GardenHud } from '../ui/GardenHud';
import { GardenMap } from '../world/GardenMap';
import { Interactables } from '../world/Interactables';

export class GardenScene extends Phaser.Scene {
  private player!: Player;
  private planting!: PlantingSystem;
  private interactables!: Interactables;
  private hud!: GardenHud;
  private inventory!: Inventory;

  constructor() {
    super({ key: 'GardenScene' });
  }

  preload(): void {
    createGardenTextures(this);
  }

  create(): void {
    const initialCoins = this.registry.get('initialCoins') as number ?? 0;

    this.physics.world.setBounds(0, 0, WORLD_WIDTH, WORLD_HEIGHT);
    this.physics.world.gravity.y = 0;

    const map = new GardenMap(this);
    this.player = new Player(this, SPAWN.x, SPAWN.y);
    this.physics.add.collider(this.player.sprite, map.obstacles);

    this.cameras.main.setBounds(0, 0, WORLD_WIDTH, WORLD_HEIGHT);
    this.cameras.main.setBackgroundColor(COLORS.grassDeep);
    this.cameras.main.startFollow(this.player.sprite, true, CAMERA_LERP, CAMERA_LERP);
    this.cameras.main.setDeadzone(48, 36);

    this.inventory = new Inventory();
    this.planting = new PlantingSystem(this, map, this.inventory);
    this.hud = new GardenHud(this, this.inventory, initialCoins);
    this.interactables = new Interactables(this, map.interactables);

    map.foliage.forEach((leaf, index) => {
      this.tweens.add({
        targets: leaf,
        angle: { from: -2.4, to: 2.4 },
        duration: 1800 + (index % 5) * 220,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut',
      });
    });

    this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      if (this.hud.isPointerOnHud(pointer, this.scale.height)) return;

      const world = this.cameras.main.getWorldPoint(pointer.x, pointer.y);
      if (this.interactables.handleWorldClick(world.x, world.y)) return;

      if (this.planting.tryPlant(world.x, world.y)) {
        this.hud.refresh();
      }
    });
  }

  update(_time: number, delta: number): void {
    this.player.update(delta);
    this.planting.update(delta);
    this.interactables.update(this.player);
  }
}
