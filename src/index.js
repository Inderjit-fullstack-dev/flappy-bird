import phaser from "phaser";
import PlayScene from "./scenes/PlayScene";

const WIDTH = 800;
const HEIGHT = 600;
const sharedConfig = {
  width: WIDTH,
  height: HEIGHT,
  birdStartPosition: {
    x: WIDTH * 0.1,
    y: HEIGHT / 2,
  },
  pipeVerticleDistanceRange: [150, 250],
  pipeHorizontalDistanceRange: [400, 450],
  flapVelocity: 150,
  maxPipePadding: 50,
  totalPipes: 4,
};

const gameConfig = {
  type: phaser.AUTO,
  ...sharedConfig,
  physics: {
    default: "arcade",
    arcade: {
      debug: true,
    },
  },
  scene: [new PlayScene(sharedConfig)],
};

new phaser.Game(gameConfig);
