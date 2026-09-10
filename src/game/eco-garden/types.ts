export type PlantStage = 'seed' | 'sprout' | 'young' | 'mature';

export type SeedId = 'oak' | 'wildflower' | 'fern';

export type InteractKind = 'tree' | 'pond' | 'house' | 'flower';

export interface EcoGardenOptions {
  initialCoins: number;
}

export interface InventoryItem {
  id: SeedId;
  name: string;
  texture: string;
  count: number;
}

export interface InteractableDef {
  id: string;
  kind: InteractKind;
  x: number;
  y: number;
  radius: number;
  title: string;
  body: string;
}

export interface BlockedCircle {
  x: number;
  y: number;
  r: number;
}

export interface BlockedRect {
  x: number;
  y: number;
  w: number;
  h: number;
}
