import phaser from "phaser";

class PlayScene extends phaser.Scene {
  constructor(config) {
    super("PlayScene");

    this.bird = null;
    this.config = config;
    this.pipes = null;
  }

  preload() {
    this.load.image("sky", "assets/sky.png");
    this.load.image("bird", "assets/bird.png");
    this.load.image("pipe", "assets/pipe.png");
  }

  create() {
    this.add.image(0, 0, "sky").setOrigin(0, 0);

    this.bird = this.physics.add
      .sprite(
        this.config.birdStartPosition.x,
        this.config.birdStartPosition.y,
        "bird"
      )
      .setOrigin(0);

    console.log("29", this.bird);

    this.bird.body.gravity.y = 150;

    this.pipes = this.physics.add.group();

    console.log("35", this.config.totalPipes);

    for (let i = 0; i < this.config.totalPipes; i++) {
      const upperPipe = this.pipes.create(0, 0, "pipe").setOrigin(0, 1);
      const lowerPipe = this.pipes.create(0, 0, "pipe").setOrigin(0, 0);
      this.placePipe(upperPipe, lowerPipe);
    }

    this.pipes.setVelocityX(-200);

    // adding physics gravity to the bird
    this.input.on("pointerdown", () => {
      this.flap(this.bird);
    });

    this.input.keyboard
      .addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)
      .on("down", () => {
        this.flap(this.bird);
      });
  }

  update() {
    if (this.bird.body.y >= this.config.height || this.bird.body.y <= 0) {
      this.restartBirdPosition();
    }

    this.recylePipes();
  }

  flap(bird) {
    console.log("55", bird);
    bird.body.velocity.y = -this.config.flapVelocity;
  }

  restartBirdPosition() {
    this.bird.body.y = this.config.birdStartPosition.y;
    this.bird.body.velocity.y = this.config.flapVelocity;
  }

  placePipe(upperPipe, lowerPipe) {
    const pipeVerticleDistance = phaser.Math.Between(
      ...this.config.pipeVerticleDistanceRange
    );

    const pipeVerticlePosition = phaser.Math.Between(
      this.config.maxPipePadding,
      this.config.height - this.config.maxPipePadding - pipeVerticleDistance
    );

    console.log("80", pipeVerticlePosition);

    const rightMostPipe = this.getRightMostPipe();
    const pipeHorizontalDistance =
      rightMostPipe +
      phaser.Math.Between(...this.config.pipeHorizontalDistanceRange);

    upperPipe.x = pipeHorizontalDistance;
    upperPipe.y = pipeVerticlePosition;

    lowerPipe.x = upperPipe.x;
    lowerPipe.y = upperPipe.y + pipeVerticleDistance;
  }

  getRightMostPipe() {
    let rightMostX = 0;
    this.pipes.getChildren().forEach(function (pipe) {
      rightMostX = Math.max(pipe.x, rightMostX);
    });

    return rightMostX;
  }

  recylePipes() {
    let temp = [];
    this.pipes.getChildren().forEach((pipe) => {
      if (pipe.getBounds().right <= 0) {
        temp.push(pipe);

        if (temp.length === 2) {
          this.placePipe(...temp);
        }
      }
    });
  }
}

export default PlayScene;
