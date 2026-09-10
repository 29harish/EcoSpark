export const WORLD_WIDTH = 2400;
export const WORLD_HEIGHT = 1800;

export const PLAYER_SPEED = 220;
export const CAMERA_LERP = 0.1;
export const INTERACT_RADIUS = 92;
export const PLANT_MIN_SPACING = 48;
export const PLANT_STAGE_MS = 8000;

export const SPAWN = { x: 1180, y: 980 };

export const COLORS = {
  grass: 0x57b87c,
  grassDark: 0x339c5d,
  grassDeep: 0x237d49,
  path: 0xdcc39a,
  pathEdge: 0xc9a878,
  water: 0x1b9fb6,
  waterDeep: 0x15657b,
  waterHighlight: 0x73d6e3,
  bark: 0x89420f,
  canopy: 0x1c643c,
  canopyLite: 0x339c5d,
  bush: 0x237d49,
  flowerPink: 0xfb6a4e,
  flowerGold: 0xfcb816,
  flowerLav: 0xa78bfa,
  rock: 0x8aa0a8,
  rockShadow: 0x5d6f75,
  houseWall: 0xfaf6ee,
  houseRoof: 0x237d49,
  houseTrim: 0x1b9fb6,
  wood: 0xa85408,
  cream: 0xfdfbf7,
  ink: 0x15422c,
  panel: 0xfffffe,
  gold: 0xfcb816,
  playerSkin: 0xffe0c2,
  playerShirt: 0x38bccf,
  playerPants: 0x1c643c,
} as const;

export const SEED_TYPES = [
  { id: 'oak', name: 'Oak Seed', texture: 'seed-oak', count: 8 },
  { id: 'wildflower', name: 'Wildflower Seed', texture: 'seed-wildflower', count: 12 },
  { id: 'fern', name: 'Fern Spore', texture: 'seed-fern', count: 10 },
] as const;
