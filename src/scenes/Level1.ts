/*
* This program is about the first level
*
* @author Zilin
* @version 1.0
* @since 2025-01-09
*/
import { Scene, GameObjects, Physics } from 'phaser';
import { DPad } from '../classes/DPad';
import { MenuButton } from './MenuButton'

export class Level1 extends Scene {
    player: Physics.Arcade.Sprite;
    cursors: Phaser.Types.Input.Keyboard.CursorKeys;
    pits: GameObjects.Group;
    dPad: DPad;
    menuButton: MenuButton;
    background: GameObjects.Image;

    constructor() {
        super('Level1');
    }

    create() {
        // Add maze walls (example tileset or sprites)
        const walls = this.physics.add.staticGroup();
        walls.create(200, 200, 'wall').setScale(2).refreshBody();

        const gameWidth = this.scale.width;
        const gameHeight = this.scale.height;

        this.background = this.add.image(0, 0, 'floor')
        .setOrigin(0, 0)
        .setDisplaySize(gameWidth, gameHeight - gameHeight / 3);

        // Add pits
        this.pits = this.add.group();
        this.pits.add(this.add.rectangle(300, 300, 50, 50, 0xff0000)); // Red pits

        // Add player
        this.player = this.physics.add.sprite(100, 100, 'player');
        this.player.setCollideWorldBounds(true);

        // Add collisions with walls
        this.physics.add.collider(this.player, walls);

        // Check for pit collisions
        this.physics.add.overlap(this.player, this.pits, () => {
            console.log('Player fell into a pit!');
            this.scene.restart(); // Restart the level
        });
    }

    update() {
        if (this.cursors.left.isDown) this.player.setVelocityX(-200);
        else if (this.cursors.right.isDown) this.player.setVelocityX(200);
        else this.player.setVelocityX(0);

        if (this.cursors.up.isDown) this.player.setVelocityY(-200);
        else if (this.cursors.down.isDown) this.player.setVelocityY(200);
        else this.player.setVelocityY(0);

        // Get movement from DPad
        const movement = this.dPad.getMovement();

        // Apply movement to player
        if (movement.up) this.player.setVelocityY(-200);
        else if (movement.down) this.player.setVelocityY(200);
        else this.player.setVelocityY(0);

        if (movement.left) this.player.setVelocityX(-200);
        else if (movement.right) this.player.setVelocityX(200);
        else this.player.setVelocityX(0);
    }
}