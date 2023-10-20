import phaser from "phaser";

class PlayScene extends phaser.Scene {
  constructor(config) {
    super("PlayScene");

    this.bird = null;
    this.config = config;
    this.pipes = null;
    this.score = 0;
    this.scoreText = "";
    this.bestScoreText = "";
  }

  preload() {
    this.load.image("sky", "assets/sky.png");
    //this.load.image("bird", "assets/bird.png");

    this.load.spritesheet("bird", "assets/birdSprite.png", {
      frameWidth: 16,
      frameHeight: 16,
    });

    this.load.image("pipe", "assets/pipe.png");
  }

  create() {
    this.createBG();

    this.createBird();

    this.animateBird();

    this.createPipes();

    this.createColliders();

    this.createScore();

    this.handleInputs();
  }

  update() {
    this.initializeBird();

    this.recylePipes();

    this.changeLevel();
  }

  createBG() {
    this.add.image(0, 0, "sky").setOrigin(0, 0);
  }

  createBird() {
    this.bird = this.physics.add
      .sprite(
        this.config.birdStartPosition.x,
        this.config.birdStartPosition.y,
        "bird"
      )
      .setScale(3)
      .setFlipX(true)
      .setOrigin(0);

    this.bird.body.gravity.y = 600;
    this.bird.setCollideWorldBounds(true);
  }

  createPipes() {
    this.pipes = this.physics.add.group();

    for (let i = 0; i < this.config.totalPipes; i++) {
      const upperPipe = this.pipes
        .create(0, 0, "pipe")
        .setImmovable()
        .setOrigin(0, 1);

      const lowerPipe = this.pipes
        .create(0, 0, "pipe")
        .setImmovable()
        .setOrigin(0, 0);
      this.placePipe(upperPipe, lowerPipe);
    }

    this.pipes.setVelocityX(-200);
  }

  createColliders() {
    this.physics.add.collider(this.bird, this.pipes, () => {
      this.gameOver();
    });
  }

  createScore() {
    this.scoreText = this.add.text(16, 16, `Score: ${this.score}`, {
      fill: "#000",
      fontSize: "14px",
      fontStyle: "bold",
    });

    if (
      localStorage.getItem("bestScore") &&
      localStorage.getItem("bestScore") > 0
    ) {
      this.bestScoreText = this.add.text(
        16,
        30,
        `Best Score: ${localStorage.getItem("bestScore")}`,
        {
          fill: "#000",
          fontSize: "14px",
          fontStyle: "bold",
        }
      );
    }
  }

  increaseScore() {
    this.score++;
    this.scoreText.setText(`Score: ${this.score}`);
  }

  handleInputs() {
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

  initializeBird() {
    if (this.bird.body.y >= this.config.height || this.bird.body.y <= 0) {
      this.gameOver();
    }
  }

  flap(bird) {
    bird.body.velocity.y = -this.config.flapVelocity;
  }

  gameOver() {
    this.physics.pause();
    const bestScore = localStorage.getItem("bestScore");
    this.bird.setAlpha(0.5).stop("fly");
    if (this.score > bestScore) {
      localStorage.setItem("bestScore", this.score);
    }
    this.time.addEvent({
      delay: 1000,
      callback: () => {
        this.scene.restart();
        this.score = 0;
        this.config.currentLevel = this.config.difficulties.easy;
      },
      loop: false,
    });
  }

  placePipe(upperPipe, lowerPipe) {
    const pipeVerticleDistance = phaser.Math.Between(
      ...this.config.currentLevel.pipeVerticleDistanceRange
    );

    const pipeVerticlePosition = phaser.Math.Between(
      this.config.maxPipePadding,
      this.config.height - this.config.maxPipePadding - pipeVerticleDistance
    );

    const rightMostPipe = this.getRightMostPipe();
    const pipeHorizontalDistance =
      rightMostPipe +
      phaser.Math.Between(
        ...this.config.currentLevel.pipeHorizontalDistanceRange
      );

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
          this.increaseScore();
        }
      }
    });
  }

  changeLevel() {
    if (this.score >= 30) {
      this.config.currentLevel = this.config.difficulties.medium;
    } else if (this.score >= 60) {
      this.config.currentLevel = this.config.difficulties.hard;
    }
  }

  animateBird() {
    this.anims.create({
      key: "fly",
      frames: this.anims.generateFrameNumbers("bird", { start: 8, end: 15 }),
      frameRate: 8,
      repeat: -1,
    });

    this.bird.play("fly");
  }
}

export default PlayScene;
