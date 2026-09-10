import Phaser from 'phaser';
import { COLORS, INTERACT_RADIUS } from '../config';
import type { InteractableDef } from '../types';
import type { Player } from '../entities/Player';

export class Interactables {
  private activeId: string | null = null;
  private readonly panel: Phaser.GameObjects.Container;
  private readonly title: Phaser.GameObjects.Text;
  private readonly body: Phaser.GameObjects.Text;

  constructor(
    private readonly scene: Phaser.Scene,
    private readonly defs: InteractableDef[],
  ) {
    const bg = scene.add.graphics();
    this.title = scene.add.text(0, -36, '', {
      fontFamily: '"Plus Jakarta Sans", sans-serif',
      fontSize: '16px',
      fontStyle: 'bold',
      color: '#15422c',
    }).setOrigin(0.5, 0);

    this.body = scene.add.text(0, -12, '', {
      fontFamily: '"Plus Jakarta Sans", sans-serif',
      fontSize: '13px',
      color: '#1c643c',
      align: 'center',
      wordWrap: { width: 240 },
    }).setOrigin(0.5, 0);

    this.panel = scene.add.container(0, 0, [bg, this.title, this.body]);
    this.panel.setDepth(4000);
    this.panel.setVisible(false);
    this.panel.setAlpha(0);

    defs.forEach((def) => {
      const hotspot = scene.add.zone(def.x, def.y, def.radius * 1.4, def.radius * 1.4);
      hotspot.setInteractive({ useHandCursor: true });
      hotspot.on('pointerdown', () => this.show(def));
    });
  }

  update(player: Player): void {
    const nearest = this.nearest(player.x, player.y);
    if (nearest && nearest.dist < INTERACT_RADIUS) {
      if (this.activeId !== nearest.def.id) this.show(nearest.def);
      this.panel.setPosition(nearest.def.x, nearest.def.y - 70);
      return;
    }

    if (this.activeId) {
      const current = this.defs.find((item) => item.id === this.activeId);
      if (!current || Phaser.Math.Distance.Between(player.x, player.y, current.x, current.y) > INTERACT_RADIUS + 36) {
        this.hide();
      }
    }
  }

  handleWorldClick(x: number, y: number): boolean {
    const nearest = this.nearest(x, y);
    if (!nearest || nearest.dist > INTERACT_RADIUS) return false;
    if (this.activeId === nearest.def.id) {
      this.hide();
    } else {
      this.show(nearest.def);
    }
    return true;
  }

  private nearest(x: number, y: number): { def: InteractableDef; dist: number } | null {
    let best: { def: InteractableDef; dist: number } | null = null;
    for (const def of this.defs) {
      const dist = Phaser.Math.Distance.Between(x, y, def.x, def.y);
      if (!best || dist < best.dist) best = { def, dist };
    }
    return best;
  }

  private show(def: InteractableDef): void {
    this.activeId = def.id;
    this.title.setText(def.title);
    this.body.setText(def.body);
    this.redraw();
    this.panel.setPosition(def.x, def.y - 70);
    this.panel.setVisible(true);
    this.scene.tweens.add({
      targets: this.panel,
      alpha: 1,
      y: def.y - 78,
      duration: 180,
      ease: 'Sine.easeOut',
    });
  }

  private hide(): void {
    this.activeId = null;
    this.scene.tweens.add({
      targets: this.panel,
      alpha: 0,
      duration: 140,
      onComplete: () => this.panel.setVisible(false),
    });
  }

  private redraw(): void {
    const bg = this.panel.list[0] as Phaser.GameObjects.Graphics;
    const width = 268;
    const height = Math.max(88, 56 + this.body.height);
    bg.clear();
    bg.fillStyle(COLORS.panel, 0.96);
    bg.fillRoundedRect(-width / 2, -44, width, height, 16);
    bg.lineStyle(3, COLORS.houseTrim, 0.85);
    bg.strokeRoundedRect(-width / 2, -44, width, height, 16);
  }
}
