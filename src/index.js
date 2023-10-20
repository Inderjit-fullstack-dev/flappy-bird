import phaser from "phaser";
import PlayScene from "./scenes/PlayScene";
import MenuScene from "./scenes/MenuScene";

const WIDTH = 800;
const HEIGHT = 600;

const difficulties = {
  easy: {
    pipeVerticleDistanceRange: [180, 280],
    pipeHorizontalDistanceRange: [400, 500],
  },
  medium: {
    pipeVerticleDistanceRange: [150, 250],
    pipeHorizontalDistanceRange: [350, 450],
  },
  hard: {
    pipeVerticleDistanceRange: [100, 200],
    pipeHorizontalDistanceRange: [250, 350],
  },
};

const currentLevel = difficulties.easy;
const sharedConfig = {
  width: WIDTH,
  height: HEIGHT,
  birdStartPosition: {
    x: WIDTH * 0.1,
    y: HEIGHT / 2,
  },
  pipeVerticleDistanceRange: [150, 250],
  pipeHorizontalDistanceRange: [500, 600],
  flapVelocity: 250,
  maxPipePadding: 50,
  totalPipes: 4,
  currentLevel: currentLevel,
  difficulties: difficulties,
};

const gameConfig = {
  type: phaser.AUTO,
  ...sharedConfig,
  pixelArt: true,
  physics: {
    default: "arcade",
  },
  scene: [new MenuScene(sharedConfig), new PlayScene(sharedConfig)],
};

new phaser.Game(gameConfig);
