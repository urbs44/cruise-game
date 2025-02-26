class BootScene extends Phaser.Scene {
    constructor() { super('BootScene'); }
    preload() { 
        console.log("BootScene: Preloading assets");
        this.load.image('loading', 'assets/loading.png');
    }
    create() { this.scene.start('PreloadScene'); }
}

class PreloadScene extends Phaser.Scene {
    constructor() { super('PreloadScene'); }
    preload() {
        console.log("PreloadScene: Loading game assets...");

        this.load.image('river', 'assets/river.png');
        this.load.image('ship', 'assets/ship.png');
        this.load.image('castle', 'assets/castle.png');
        this.load.audio('shutterSound', 'assets/shutter.mp3');

        this.load.on('filecomplete', (key) => console.log(`Loaded: ${key}`));
        this.load.on('loaderror', (file) => console.error(`Failed to load: ${file.src}`));
    }
    create() {
        console.log("PreloadScene: Assets loaded successfully");
        this.scene.start('MainScene');
    }
}

class MainScene extends Phaser.Scene {
    constructor() { super('MainScene'); }
    create() {
        console.log("MainScene: Creating river background");
        this.background = this.add.tileSprite(400, 300, 800, 600, 'river');
        
        console.log("MainScene: Adding ship");
        this.ship = this.add.image(400, 500, 'ship').setScale(0.5);
        this.tweens.add({
            targets: this.ship,
            x: 700,
            duration: 10000,
            ease: 'Linear',
            yoyo: true,
            repeat: -1
        });
        
        console.log("MainScene: Adding points of interest");
        this.castle = this.add.image(300, 300, 'castle').setScale(0.5);
        this.castle.setInteractive();
        this.castle.on('pointerdown', () => {
            alert("You have reached a historic castle! Enjoy the view!");
        });
        
        this.add.text(250, 50, 'Uniworld Cruise: Amsterdam to Basel', { fontSize: '24px', fill: '#ffffff' });
    }
    update() {
        this.background.tilePositionX += 1;
    }
}

// Initial game setup using Phaser.js
const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'game-container',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    scene: [BootScene, PreloadScene, MainScene]
};

let game = new Phaser.Game(config);

game.events.on('ready', () => console.log("Game successfully initialized"));
game.events.on('error', (err) => console.error("Game Error:", err));
