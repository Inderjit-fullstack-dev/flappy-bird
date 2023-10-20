import phaser from "phaser";

class MenuScene extends phaser.Scene {
  constructor(config) {
    super("MenuScene");
    this.config = config;
  }

  preload() {
    this.load.image("sky", "assets/sky.png");
    this.load.image("logo", "assets/small_logo.png");
    this.load.image("play_btn", "assets/play.png");
  }
  create() {
    this.createBG();
  }
  update() {}

  createBG() {
    this.add.image(0, 0, "sky").setOrigin(0, 0);
    this.add
      .image(this.config.width / 2, this.config.height / 2 - 80, "logo")
      .setOrigin(0.5, 0.5);

    const playButton = this.add
      .image(this.config.width / 2, this.config.height / 2, "play_btn")
      .setInteractive()
      .setOrigin(0.5, 0.5);

    playButton.on("pointerdown", () => {
      this.play();
    });
  }

  play() {
    this.scene.start("PlayScene");
  }
}

export default MenuScene;
