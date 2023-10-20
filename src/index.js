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
const pipeVerticleDistanceRange = [150, 250];
const pipeHorizontalDistanceRange = [400, 450];

const FLAP_VELOCITY = 150;
const intialBirdPosition = {
  x: gameConfig.width * 0.1,
  y: gameConfig.height / 2,
};

const TOTAL_PIPES = 4;

let pipes = null;

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

  // creating groups
  pipes = this.physics.add.group();

  for (let i = 0; i < TOTAL_PIPES; i++) {
    const uPipe = pipes.create(0, 0, "pipe").setOrigin(0, 1);
    const lPipe = pipes.create(0, 0, "pipe").setOrigin(0, 0);
    placePipe(uPipe, lPipe);
  }

  pipes.setVelocityX(-200);

  // adding physics gravity to the bird

  bird.body.gravity.y = 150;

  this.input.on("pointerdown", flap);

  this.input.keyboard
    .addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)
    .on("down", flap);
}

function update() {
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

function placePipe(uPipe, lPipe) {
  const pipeVerticleDistance = phaser.Math.Between(
    ...pipeVerticleDistanceRange
  );

  const pipeVerticlePosition = phaser.Math.Between(
    50,
    gameConfig.height - 50 - pipeVerticleDistance
  );

  const rightMostPipe = getRightMostPipe();
  const pipeHorizontalDistance =
    rightMostPipe + phaser.Math.Between(...pipeHorizontalDistanceRange);

  uPipe.x = pipeHorizontalDistance;
  uPipe.y = pipeVerticlePosition;

  lPipe.x = uPipe.x;
  lPipe.y = uPipe.y + pipeVerticleDistance;
}

function getRightMostPipe() {
  let rightMostX = 0;
  pipes.getChildren().forEach(function (pipe) {
    rightMostX = Math.max(pipe.x, rightMostX);
  });

  return rightMostX;
}

new phaser.Game(gameConfig);
