import { SEED_TYPES } from '../config';
import type { InventoryItem, SeedId } from '../types';

export class Inventory {
  readonly items: InventoryItem[];
  selectedId: SeedId | null;

  constructor() {
    this.items = SEED_TYPES.map((seed) => ({ ...seed }));
    this.selectedId = this.items[0]?.id ?? null;
  }

  select(id: SeedId): void {
    this.selectedId = id;
  }

  selected(): InventoryItem | null {
    return this.items.find((item) => item.id === this.selectedId) ?? null;
  }

  spendSelected(): boolean {
    const item = this.selected();
    if (!item || item.count <= 0) return false;
    item.count -= 1;
    return true;
  }
}
