import Phaser from 'phaser';
import { PLAYER_SPEED } from '../config';

export class Player {
  readonly sprite: Phaser.Physics.Arcade.Sprite;
  private readonly cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  private readonly wasd: Record<'up' | 'down' | 'left' | 'right', Phaser.Input.Keyboard.Key>;
  private bob = 0;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    this.sprite = scene.physics.add.sprite(x, y, 'player');
    this.sprite.setCollideWorldBounds(true);
    this.sprite.setDepth(y);
    this.sprite.setSize(22, 16);
    this.sprite.setOffset(9, 36);

    const body = this.sprite.body as Phaser.Physics.Arcade.Body;
    body.setMaxSpeed(PLAYER_SPEED);
    body.setDrag(1400, 1400);
    body.setAllowGravity(false);

    const keyboard = scene.input.keyboard;
    if (!keyboard) {
      throw new Error('Keyboard input is required for Eco Garden');
    }

    this.cursors = keyboard.createCursorKeys();
    this.wasd = {
      up: keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
      down: keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
      left: keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
      right: keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D),
    };
  }

  get x(): number {
    return this.sprite.x;
  }

  get y(): number {
    return this.sprite.y;
  }

  update(delta: number): void {
    let vx = 0;
    let vy = 0;

    if (this.cursors.left.isDown || this.wasd.left.isDown) vx -= 1;
    if (this.cursors.right.isDown || this.wasd.right.isDown) vx += 1;
    if (this.cursors.up.isDown || this.wasd.up.isDown) vy -= 1;
    if (this.cursors.down.isDown || this.wasd.down.isDown) vy += 1;

    const moving = vx !== 0 || vy !== 0;
    if (moving) {
      const length = Math.hypot(vx, vy);
      vx = (vx / length) * PLAYER_SPEED;
      vy = (vy / length) * PLAYER_SPEED;
      this.sprite.setFlipX(vx < 0);
    }

    this.sprite.setVelocity(vx, vy);
    this.sprite.setDepth(this.sprite.y);

    this.bob += delta * 0.012;
    const bob = moving ? Math.sin(this.bob) * 0.06 : Math.sin(this.bob * 0.4) * 0.02;
    this.sprite.setScale(1, 1 + bob);
  }
}
