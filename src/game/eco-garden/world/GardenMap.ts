import Phaser from 'phaser';
import { COLORS, WORLD_HEIGHT, WORLD_WIDTH } from '../config';
import type { BlockedCircle, BlockedRect, InteractableDef } from '../types';

interface TreeSpot {
  x: number;
  y: number;
  scale: number;
  fact: string;
}

const TREES: TreeSpot[] = [
  { x: 420, y: 380, scale: 1.15, fact: 'A mature tree can absorb about 22 kg of CO2 each year.' },
  { x: 680, y: 260, scale: 1, fact: 'Tree canopies cool streets and cut urban heat.' },
  { x: 980, y: 320, scale: 1.2, fact: 'Native trees support local birds and insects.' },
  { x: 1860, y: 420, scale: 1.1, fact: 'Roots hold soil in place and prevent erosion.' },
  { x: 2100, y: 560, scale: 0.95, fact: 'Forests store carbon in wood, roots, and soil.' },
  { x: 320, y: 1280, scale: 1.05, fact: 'Planting trees near waterways filters runoff.' },
  { x: 540, y: 1500, scale: 1.25, fact: 'Diverse tree species make a garden more resilient.' },
  { x: 1680, y: 1480, scale: 1.1, fact: 'Shade trees reduce the need for air conditioning.' },
  { x: 2040, y: 1320, scale: 1, fact: 'Fallen leaves become natural compost for soil.' },
];

const FLOWERS: { x: number; y: number; key: string }[] = [
  { x: 860, y: 720, key: 'flower-pink' },
  { x: 900, y: 760, key: 'flower-gold' },
  { x: 820, y: 780, key: 'flower-lav' },
  { x: 1480, y: 640, key: 'flower-gold' },
  { x: 1520, y: 680, key: 'flower-pink' },
  { x: 1460, y: 700, key: 'flower-lav' },
  { x: 760, y: 1340, key: 'flower-pink' },
  { x: 800, y: 1380, key: 'flower-gold' },
  { x: 1720, y: 1100, key: 'flower-lav' },
  { x: 1760, y: 1140, key: 'flower-pink' },
];

const BUSHES = [
  { x: 1100, y: 420 },
  { x: 1280, y: 460 },
  { x: 400, y: 900 },
  { x: 1980, y: 900 },
  { x: 1240, y: 1560 },
  { x: 900, y: 1080 },
];

const ROCKS = [
  { x: 600, y: 620 },
  { x: 1620, y: 500 },
  { x: 280, y: 1040 },
  { x: 2140, y: 1080 },
  { x: 1400, y: 1420 },
];

const PATHS: BlockedRect[] = [
  { x: 1080, y: 760, w: 180, h: 620 },
  { x: 720, y: 860, w: 720, h: 90 },
  { x: 1260, y: 860, w: 420, h: 80 },
  { x: 1640, y: 720, w: 90, h: 240 },
];

const POND = { x: 1680, y: 980, r: 108 };
const HOUSE = { x: 1180, y: 620, w: 140, h: 70 };

export class GardenMap {
  readonly obstacles: Phaser.Physics.Arcade.StaticGroup;
  readonly blockedRects: BlockedRect[] = [...PATHS, { x: HOUSE.x - HOUSE.w / 2, y: HOUSE.y - 20, w: HOUSE.w, h: HOUSE.h }];
  readonly blockedCircles: BlockedCircle[] = [{ x: POND.x, y: POND.y, r: POND.r }];
  readonly interactables: InteractableDef[] = [];
  readonly foliage: Phaser.GameObjects.Image[] = [];

  constructor(scene: Phaser.Scene) {
    this.paintGround(scene);
    this.obstacles = scene.physics.add.staticGroup();

    this.placePond(scene);
    this.placeHouse(scene);
    this.placeTrees(scene);
    this.placeFlowers(scene);
    this.placeBushes(scene);
    this.placeRocks(scene);
  }

  isPlantable(x: number, y: number): boolean {
    if (x < 80 || y < 80 || x > WORLD_WIDTH - 80 || y > WORLD_HEIGHT - 80) return false;

    for (const rect of this.blockedRects) {
      if (x >= rect.x && x <= rect.x + rect.w && y >= rect.y && y <= rect.y + rect.h) {
        return false;
      }
    }

    for (const circle of this.blockedCircles) {
      if (Phaser.Math.Distance.Between(x, y, circle.x, circle.y) < circle.r + 12) {
        return false;
      }
    }

    return true;
  }

  private paintGround(scene: Phaser.Scene): void {
    scene.add.rectangle(WORLD_WIDTH / 2, WORLD_HEIGHT / 2, WORLD_WIDTH, WORLD_HEIGHT, COLORS.grass).setDepth(-20);

    const patches = scene.add.graphics().setDepth(-19);
    patches.fillStyle(COLORS.grassDark, 0.28);
    for (let i = 0; i < 70; i += 1) {
      const x = 80 + ((i * 137) % (WORLD_WIDTH - 160));
      const y = 80 + ((i * 211) % (WORLD_HEIGHT - 160));
      patches.fillEllipse(x, y, 90 + (i % 5) * 18, 48 + (i % 4) * 12);
    }
    patches.fillStyle(COLORS.grassDeep, 0.12);
    for (let i = 0; i < 40; i += 1) {
      patches.fillCircle(140 + ((i * 173) % (WORLD_WIDTH - 280)), 140 + ((i * 97) % (WORLD_HEIGHT - 280)), 18);
    }

    const path = scene.add.graphics().setDepth(-18);
    path.fillStyle(COLORS.path, 1);
    path.lineStyle(6, COLORS.pathEdge, 0.7);
    for (const rect of PATHS) {
      path.fillRoundedRect(rect.x, rect.y, rect.w, rect.h, 28);
      path.strokeRoundedRect(rect.x, rect.y, rect.w, rect.h, 28);
    }
  }

  private placePond(scene: Phaser.Scene): void {
    const pond = scene.physics.add.staticImage(POND.x, POND.y, 'pond');
    pond.setDepth(POND.y - 40);
    pond.setCircle(90, 40, 10);
    pond.refreshBody();
    this.obstacles.add(pond);

    this.interactables.push({
      id: 'pond',
      kind: 'pond',
      x: POND.x,
      y: POND.y,
      radius: 140,
      title: 'Garden Pond',
      body: 'A small pond stores rainwater, cools the garden, and gives frogs and insects a home.',
    });
  }

  private placeHouse(scene: Phaser.Scene): void {
    const house = scene.physics.add.staticImage(HOUSE.x, HOUSE.y, 'house');
    house.setOrigin(0.5, 0.82);
    house.setDepth(HOUSE.y);
    house.setSize(HOUSE.w, HOUSE.h);
    house.setOffset(30, 92);
    house.refreshBody();
    this.obstacles.add(house);

    this.interactables.push({
      id: 'house',
      kind: 'house',
      x: HOUSE.x,
      y: HOUSE.y - 20,
      radius: 130,
      title: 'Eco House',
      body: 'This cottage uses a living roof, rain barrels, and shade trees to stay cool without extra energy.',
    });
  }

  private placeTrees(scene: Phaser.Scene): void {
    TREES.forEach((spot, index) => {
      const tree = scene.physics.add.staticImage(spot.x, spot.y, 'tree');
      tree.setOrigin(0.5, 0.92);
      tree.setScale(spot.scale);
      tree.setDepth(spot.y);
      tree.setSize(28, 22);
      tree.setOffset(34, 98);
      tree.refreshBody();
      this.obstacles.add(tree);
      this.foliage.push(tree);
      this.blockedCircles.push({ x: spot.x, y: spot.y, r: 36 * spot.scale });

      this.interactables.push({
        id: `tree-${index}`,
        kind: 'tree',
        x: spot.x,
        y: spot.y - 40,
        radius: 80,
        title: 'Garden Tree',
        body: spot.fact,
      });
    });
  }

  private placeFlowers(scene: Phaser.Scene): void {
    const clusters = new Map<string, { x: number; y: number; n: number }>();

    FLOWERS.forEach((flower) => {
      const image = scene.add.image(flower.x, flower.y, flower.key).setDepth(flower.y);
      this.foliage.push(image);

      const bucket = `${Math.round(flower.x / 160)}:${Math.round(flower.y / 160)}`;
      const existing = clusters.get(bucket);
      if (existing) {
        existing.n += 1;
        existing.x = (existing.x + flower.x) / 2;
        existing.y = (existing.y + flower.y) / 2;
      } else {
        clusters.set(bucket, { x: flower.x, y: flower.y, n: 1 });
      }
    });

    let i = 0;
    clusters.forEach((cluster) => {
      this.interactables.push({
        id: `flowers-${i}`,
        kind: 'flower',
        x: cluster.x,
        y: cluster.y,
        radius: 70,
        title: 'Wildflowers',
        body: 'Flower patches feed bees and butterflies. Even a small bed can boost pollination.',
      });
      i += 1;
    });
  }

  private placeBushes(scene: Phaser.Scene): void {
    BUSHES.forEach((spot) => {
      const bush = scene.add.image(spot.x, spot.y, 'bush').setDepth(spot.y);
      this.foliage.push(bush);
    });
  }

  private placeRocks(scene: Phaser.Scene): void {
    ROCKS.forEach((spot) => {
      const rock = scene.physics.add.staticImage(spot.x, spot.y, 'rock');
      rock.setDepth(spot.y);
      rock.setSize(34, 16);
      rock.setOffset(7, 12);
      rock.refreshBody();
      this.obstacles.add(rock);
      this.blockedCircles.push({ x: spot.x, y: spot.y, r: 28 });
    });
  }
}
