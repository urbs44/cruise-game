class BootScene extends Phaser.Scene {
    constructor() { super('BootScene'); }
    preload() { 
        console.log("BootScene: Preloading assets");
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
        this.background = this.add.tileSprite(400, 300, 1600, 600, 'river');

        console.log("MainScene: Adding ship with movement controls");
        this.ship = this.physics.add.sprite(200, 500, 'ship').setScale(0.6);
        this.ship.setCollideWorldBounds(true);
        this.cursors = this.input.keyboard.createCursorKeys();

        console.log("MainScene: Adding destinations");
        this.destinations = [
            { name: "Cologne", x: 400, y: 280, image: "castle", info: "Cologne: Famous for its Gothic Cathedral!" },
            { name: "Strasbourg", x: 600, y: 280, image: "castle", info: "Strasbourg: A mix of French & German culture." },
            { name: "Basel", x: 800, y: 280, image: "castle", info: "Basel: The cultural hub of Switzerland!" }
        ];

        this.destinationSprites = [];
        this.destinations.forEach(dest => {
            let sprite = this.add.image(dest.x, dest.y, dest.image).setScale(0.45);
            sprite.setInteractive();
            sprite.on('pointerdown', () => this.showDestinationInfo(dest.info));
            this.destinationSprites.push(sprite);
        });

        this.add.text(180, 20, 'Uniworld Cruise: Amsterdam to Basel', { fontSize: '24px', fill: '#ffffff' });
        this.visitedDestinations = new Set();
    }

    update() {
        this.background.tilePositionX += 0.5;
        
        if (this.cursors.left.isDown) {
            this.ship.setVelocityX(-100);
        } else if (this.cursors.right.isDown) {
            this.ship.setVelocityX(100);
        } else {
            this.ship.setVelocityX(0);
        }

        this.destinationSprites.forEach((sprite, index) => {
            if (Phaser.Math.Distance.Between(this.ship.x, this.ship.y, sprite.x, sprite.y) < 50) {
                let dest = this.destinations[index];
                if (!this.visitedDestinations.has(dest.name)) {
                    this.visitedDestinations.add(dest.name);
                    this.showDestinationInfo(dest.info);
                }
            }
        });

        if (this.visitedDestinations.size === this.destinations.length) {
            this.add.text(250, 550, 'Cruise Completed! 🎉', { fontSize: '24px', fill: '#ffcc00' });
        }
    }

    showDestinationInfo(info) {
        let popup = this.add.text(150, 100, info, { fontSize: '20px', fill: '#ffffff', backgroundColor: '#000000', padding: { x: 10, y: 5 } });
        setTimeout(() => popup.destroy(), 3000);
    }
}

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
