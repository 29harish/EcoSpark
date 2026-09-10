import Phaser from 'phaser';
import { COLORS } from '../config';
import type { Inventory } from '../systems/Inventory';
import type { SeedId } from '../types';

export class GardenHud {
  readonly height = 108;
  private readonly coinText: Phaser.GameObjects.Text;
  private readonly countLabels: Phaser.GameObjects.Text[] = [];
  private readonly highlights: Phaser.GameObjects.Rectangle[] = [];

  constructor(
    scene: Phaser.Scene,
    private readonly inventory: Inventory,
    initialCoins: number,
  ) {
    const { width, height } = scene.scale;

    const coinBg = scene.add.rectangle(24, 20, 148, 44, COLORS.panel, 0.94)
      .setOrigin(0, 0)
      .setScrollFactor(0)
      .setDepth(5000)
      .setStrokeStyle(2, COLORS.gold);

    scene.add.image(48, 42, 'coin').setScrollFactor(0).setDepth(5001);
    this.coinText = scene.add.text(70, 30, String(initialCoins), {
      fontFamily: '"Plus Jakarta Sans", sans-serif',
      fontSize: '18px',
      fontStyle: 'bold',
      color: '#a85408',
    }).setScrollFactor(0).setDepth(5001);

    scene.add.text(70, 48, 'Eco Coins', {
      fontFamily: '"Plus Jakarta Sans", sans-serif',
      fontSize: '10px',
      color: '#1c643c',
    }).setScrollFactor(0).setDepth(5001);

    void coinBg;

    const trayWidth = 286;
    const trayX = width / 2;
    const trayY = height - 28;

    scene.add.rectangle(trayX, trayY, trayWidth, 72, COLORS.panel, 0.94)
      .setScrollFactor(0)
      .setDepth(5000)
      .setStrokeStyle(2, COLORS.houseTrim);

    scene.add.text(trayX, trayY - 46, 'Seeds · click a plot of grass to plant', {
      fontFamily: '"Plus Jakarta Sans", sans-serif',
      fontSize: '11px',
      color: '#1c643c',
    }).setOrigin(0.5).setScrollFactor(0).setDepth(5001);

    inventory.items.forEach((item, index) => {
      const x = trayX - 86 + index * 86;
      const y = trayY + 4;
      const highlight = scene.add.rectangle(x, y, 68, 56, 0xddf3e2, 1)
        .setScrollFactor(0)
        .setDepth(5001)
        .setStrokeStyle(3, COLORS.houseTrim)
        .setInteractive({ useHandCursor: true });

      highlight.on('pointerdown', () => {
        this.inventory.select(item.id as SeedId);
        this.refresh();
      });

      scene.add.image(x, y - 6, item.texture).setScrollFactor(0).setDepth(5002);
      const count = scene.add.text(x, y + 16, `x${item.count}`, {
        fontFamily: '"Plus Jakarta Sans", sans-serif',
        fontSize: '11px',
        fontStyle: 'bold',
        color: '#15422c',
      }).setOrigin(0.5).setScrollFactor(0).setDepth(5002);

      this.highlights.push(highlight);
      this.countLabels.push(count);
    });

    scene.add.text(24, 74, 'WASD or arrows to walk', {
      fontFamily: '"Plus Jakarta Sans", sans-serif',
      fontSize: '12px',
      color: '#15422c',
      backgroundColor: '#fffffecc',
      padding: { x: 8, y: 4 },
    }).setScrollFactor(0).setDepth(5001);

    this.refresh();
  }

  isPointerOnHud(pointer: Phaser.Input.Pointer, viewHeight: number): boolean {
    return pointer.y > viewHeight - this.height || (pointer.x < 180 && pointer.y < 80);
  }

  refresh(): void {
    this.inventory.items.forEach((item, index) => {
      this.countLabels[index]?.setText(`x${item.count}`);
      const selected = item.id === this.inventory.selectedId;
      this.highlights[index]?.setStrokeStyle(3, selected ? COLORS.gold : COLORS.houseTrim);
      this.highlights[index]?.setFillStyle(selected ? 0xfff3c4 : 0xddf3e2);
    });
  }
}
