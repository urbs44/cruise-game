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

        this.load.image('river', '/assets/river.png');
        this.load.image('ship', '/assets/ship.png');
        this.load.image('castle', '/assets/castle.png');
        this.load.audio('shutterSound', '/assets/shutter.mp3');

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
        this.background = this.add.tileSprite(400, 300, 1600, 600, 'river'); // Wider background to scroll smoothly

        console.log("MainScene: Adding ship");
        this.ship = this.add.image(200, 500, 'ship').setScale(0.6); // Lower position to align with river
        
        this.tweens.add({
            targets: this.ship,
            x: 600, // Ship moves more naturally
            duration: 12000,
            ease: 'Linear',
            yoyo: true,
            repeat: -1
        });

        console.log("MainScene: Adding points of interest");
        this.castle = this.add.image(400, 280, 'castle').setScale(0.45); // Adjusted to fit naturally in the scene
        this.castle.setInteractive();
        this.castle.on('pointerdown', () => {
            alert("You have reached a historic castle! Enjoy the view!");
        });

        // Ensure correct layering so ship stays in front of the river
        this.ship.depth = 1; 
        this.castle.depth = 2;

        this.add.text(200, 20, 'Uniworld Cruise: Amsterdam to Basel', { fontSize: '24px', fill: '#ffffff' });
    }

    update() {
        this.background.tilePositionX += 0.5; // Slower background movement for a smooth cruise effect
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
