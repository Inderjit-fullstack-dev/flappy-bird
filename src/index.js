import phaser from "phaser";

const gameConfig = {
  type: phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
    default: "arcade",
    arcade: {
      debug: true,
    },
  },
  scene: {
    // preload assets before redering.
    preload,

    // draw on the canvas
    create,
    update,
  },
};

let bird = null;
let upperPipe = null;
let lowerPipe = null;
const pipeDistanceRange = [150, 250];
let pipeDistance = phaser.Math.Between(...pipeDistanceRange);
let pipeVerticlePosition = getVerticlePosition(50);
const FLAP_VELOCITY = 100;
const intialBirdPosition = {
  x: gameConfig.width * 0.1,
  y: gameConfig.height / 2,
};

const TOTAL_PIPES = 4;
let pipeHorizontalDistance = 0;

function preload() {
  this.load.image("sky", "assets/sky.png");
  this.load.image("bird", "assets/bird.png");
  this.load.image("pipe", "assets/pipe.png");
}

function create() {
  /* 
    actual image is of 800*400 size and 400 (x) and 
    300 (y) is the center point where its anchor point exists.
  */

  this.add.image(0, 0, "sky").setOrigin(0, 0);

  bird = this.physics.add
    .sprite(intialBirdPosition.x, intialBirdPosition.y, "bird")
    .setOrigin(0);

  for (let i = 0; i < TOTAL_PIPES; i++) {
    const uPipe = this.physics.add.sprite(0, 0, "pipe").setOrigin(0, 1);
    const lPipe = this.physics.add.sprite(0, 0, "pipe").setOrigin(0, 0);
    placePipe(uPipe, lPipe);
  }

  // adding physics gravity to the bird

  bird.body.gravity.y = 150;

  this.input.on("pointerdown", flap);

  this.input.keyboard
    .addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)
    .on("down", flap);
}

function update(time, delta) {
  if (bird.body.y >= gameConfig.height || bird.body.y <= 0) {
    restartBirdPosition();
  }
}

function flap() {
  bird.body.velocity.y = -FLAP_VELOCITY;
}

function restartBirdPosition() {
  bird.body.y = intialBirdPosition.y;
  bird.body.velocity.y = FLAP_VELOCITY;
}

function getVerticlePosition(range) {
  return phaser.Math.Between(range, gameConfig.height - range - pipeDistance);
}

function placePipe(uPipe, lPipe) {
  pipeHorizontalDistance += 400;
  console.log("pipeHorizontalDistance", pipeHorizontalDistance);
  pipeVerticlePosition = getVerticlePosition(50);

  uPipe.x = pipeHorizontalDistance;
  uPipe.y = pipeVerticlePosition;

  lPipe.x = uPipe.x;
  lPipe.y = uPipe.y + pipeDistance;

  uPipe.body.velocity.x = -200;
  lPipe.body.velocity.x = -200;
}

new phaser.Game(gameConfig);
