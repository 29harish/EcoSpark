import Phaser from 'phaser';
import { PLANT_MIN_SPACING } from '../config';
import type { SeedId } from '../types';
import { Plant } from '../entities/Plant';
import type { Inventory } from './Inventory';
import type { GardenMap } from '../world/GardenMap';

export class PlantingSystem {
  readonly plants: Plant[] = [];

  constructor(
    private readonly scene: Phaser.Scene,
    private readonly map: GardenMap,
    private readonly inventory: Inventory,
  ) {}

  tryPlant(x: number, y: number): boolean {
    const seed = this.inventory.selected();
    if (!seed || seed.count <= 0) return false;
    if (!this.map.isPlantable(x, y)) return false;

    for (const plant of this.plants) {
      if (Phaser.Math.Distance.Between(x, y, plant.x, plant.y) < PLANT_MIN_SPACING) {
        return false;
      }
    }

    if (!this.inventory.spendSelected()) return false;

    const plant = new Plant(this.scene, x, y, seed.id as SeedId);
    this.plants.push(plant);
    return true;
  }

  update(delta: number): void {
    for (const plant of this.plants) {
      plant.update(delta, this.scene);
    }
  }
}
