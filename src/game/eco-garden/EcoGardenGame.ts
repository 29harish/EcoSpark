import Phaser from 'phaser';
import { GardenScene } from './scenes/GardenScene';
import type { EcoGardenOptions } from './types';

export function createEcoGardenGame(parent: HTMLElement, options: EcoGardenOptions): Phaser.Game {
  const game = new Phaser.Game({
    type: Phaser.AUTO,
    parent,
    backgroundColor: '#237d49',
    scale: {
      mode: Phaser.Scale.RESIZE,
      autoCenter: Phaser.Scale.CENTER_BOTH,
      width: '100%',
      height: '100%',
    },
    physics: {
      default: 'arcade',
      arcade: {
        gravity: { x: 0, y: 0 },
        debug: false,
      },
    },
    render: {
      antialias: true,
      roundPixels: true,
    },
    audio: {
      noAudio: true,
    },
    scene: [GardenScene],
    callbacks: {
      preBoot: (booting) => {
        booting.registry.set('initialCoins', options.initialCoins);
      },
    },
  });

  return game;
}

export function destroyEcoGardenGame(game: Phaser.Game | null): void {
  if (!game) return;
  game.destroy(true);
}
