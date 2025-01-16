/*
 * Main game program
 *
 * @author Zilin
 * @version 1.0
 * @since 2024-12-13
 */

import { Scene } from 'phaser';
import Rock from "../classes/Rock";
import MenuButton from "../classes/MenuButton";
import Box from "../classes/Box";
import Key from "../classes/Key";
import Stair from "../classes/Stair";
import Player from "../classes/Player";

export class Game extends Scene
{
    camera: Phaser.Cameras.Scene2D.Camera;
    background: Phaser.GameObjects.Image;
    msg_text : Phaser.GameObjects.Text;
    private player!: Player;
    cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
    pits: Phaser.Physics.Arcade.Group;
    private menuButton: MenuButton;
    purplePortal: Phaser.GameObjects.Image;
    arrow: Phaser.GameObjects.Image;
    redPortal: Phaser.GameObjects.Image;
    private rock!: Rock;
    private wallGroup!: Phaser.Physics.Arcade.Group;
    private brokenWallGroup!: Phaser.Physics.Arcade.StaticGroup;

    constructor ()
    {
        super('Game');
        this.input?.keyboard?.createCursorKeys() || null;
    }

    create ()
    {
        this.camera = this.cameras.main;
        this.camera.setBackgroundColor(0x00ff00);

        // Set screen size constants
        const screenWidth = 1170;
        const screenHeight = 2532;
        const itemHeigh = 165
        const itemWidth = 165
        const xOfItem = (screenWidth / 7)
        const yOfItem = (screenHeight / 15)

        // Add background floor
        this.background = this.add.image(screenWidth / 2, screenHeight / 2, "floor")
        .setDisplaySize(1170, 2532);
        this.background = this.add.image(xOfItem, yOfItem * 5, "floor")
        .setDisplaySize(screenWidth * 2, screenHeight / 5 * 3);

        // add player
        this.player = new Player(this, 50, yOfItem + 50, "player");
        if (!this.player) {
            console.error('Player failed to initialize.');
        }

        // Add walls
        const wall = this.physics.add.staticGroup();
        wall.create(xOfItem * 0 + 50, yOfItem * 8 + 50, "wall")
        .setDisplaySize(itemWidth, itemWidth).refreshBody();
        wall.create(xOfItem * 1 + 50, 50, "wall")
        .setDisplaySize(itemWidth, itemWidth).refreshBody();
        wall.create(xOfItem * 1 + 50, yOfItem * 1 + 50, "wall")
        .setDisplaySize(itemWidth, itemWidth).refreshBody();
        wall.create(xOfItem * 1 + 50, yOfItem * 3 + 50, "wall")
        .setDisplaySize(itemWidth, itemWidth).refreshBody();
        wall.create(xOfItem * 1 + 50, yOfItem * 4 + 50, "wall")
        .setDisplaySize(itemWidth, itemWidth).refreshBody();
        wall.create(xOfItem * 1 + 50, yOfItem * 5 + 50, "wall")
        .setDisplaySize(itemWidth, itemWidth).refreshBody();
        wall.create(xOfItem * 1 + 50, yOfItem * 6 + 50, "wall")
        .setDisplaySize(itemWidth, itemWidth).refreshBody();
        wall.create(xOfItem * 1 + 50, yOfItem * 8 + 50, "wall")
        .setDisplaySize(itemWidth, itemWidth).refreshBody();
        wall.create(xOfItem * 2 + 50, yOfItem * 6 + 50, "wall")
        .setDisplaySize(itemWidth, itemWidth).refreshBody();
        wall.create(xOfItem * 2 + 50, yOfItem * 8 + 50, "wall")
        .setDisplaySize(itemWidth, itemWidth).refreshBody();
        wall.create(xOfItem * 3 + 50, 50, "wall")
        .setDisplaySize(itemWidth, itemWidth).refreshBody();
        wall.create(xOfItem * 3 + 50, yOfItem * 1 + 50, "wall")
        .setDisplaySize(itemWidth, itemWidth).refreshBody();
        wall.create(xOfItem * 3 + 50, yOfItem * 2 + 50, "wall")
        .setDisplaySize(itemWidth, itemWidth).refreshBody();
        wall.create(xOfItem * 3 + 50, yOfItem * 3 + 50, "wall")
        .setDisplaySize(itemWidth, itemWidth).refreshBody();
        wall.create(xOfItem * 3 + 50, yOfItem * 4 + 50, "wall")
        .setDisplaySize(itemWidth, itemWidth).refreshBody();
        wall.create(xOfItem * 3 + 50, yOfItem * 6 + 50, "wall")
        .setDisplaySize(itemWidth, itemWidth).refreshBody();
        wall.create(xOfItem * 3 + 50, yOfItem * 8 + 50, "wall")
        .setDisplaySize(itemWidth, itemWidth).refreshBody();
        wall.create(xOfItem * 4 + 50, yOfItem * 6 + 50, "wall")
        .setDisplaySize(itemWidth, itemWidth).refreshBody();
        wall.create(xOfItem * 4 + 50, yOfItem * 8 + 50, "wall")
        .setDisplaySize(itemWidth, itemWidth).refreshBody();
        wall.create(xOfItem * 5 + 50, yOfItem * 0 + 50, "wall")
        .setDisplaySize(itemWidth, itemWidth).refreshBody();
        wall.create(xOfItem * 5 + 50, yOfItem * 2 + 50, "wall")
        .setDisplaySize(itemWidth, itemWidth).refreshBody();
        wall.create(xOfItem * 5 + 50, yOfItem * 5 + 50, "wall")
        .setDisplaySize(itemWidth, itemWidth).refreshBody();
        wall.create(xOfItem * 5 + 50, yOfItem * 6 + 50, "wall")
        .setDisplaySize(itemWidth, itemWidth).refreshBody();
        wall.create(xOfItem * 5 + 50, yOfItem * 8 + 50, "wall")
        .setDisplaySize(itemWidth, itemWidth).refreshBody();
        wall.create(xOfItem * 6 + 50, yOfItem * 8 + 50, "wall")
        .setDisplaySize(itemWidth, itemWidth).refreshBody();
        wall.create(xOfItem * 7 + 50, yOfItem * 8 + 50, "wall")
        .setDisplaySize(itemWidth, itemWidth).refreshBody();

        // Add collision between player and walls
        this.physics.add.collider(this.player.sprite, wall);

        // Add a rock
        this.rock = new Rock(this, xOfItem + 50, yOfItem * 7 + 50, "rock");
        this.physics.add.collider(this.player.sprite, this.rock.sprite, () => {
            if (this.player.sprite.body) {
                this.rock.moveOpposite(
                    new Phaser.Math.Vector2(
                        this.player.sprite.body.velocity.x,
                        this.player.sprite.body.velocity.y));
            }
        });

        // Create broken wall group
        this.brokenWallGroup = this.physics.add.staticGroup();
        this.brokenWallGroup.create(xOfItem * 4 + 50, yOfItem * 7 + 50, "brokenWall")
        .setDisplaySize(itemWidth, itemHeigh).refreshBody();

        // Add collision between player and broken wall
        this.physics.add.collider(this.player.sprite, this.brokenWallGroup);

        // Add collision handling for the rock
        if (this.rock) {
            this.rock.handleCollisions(this, this.wallGroup, this.brokenWallGroup);
        } else {
            console.error('Rock is not defined');
        }

        // Add a purple portal
        this.purplePortal = this.add.image(50, 50, "purplePortal")
        .setDisplaySize(itemWidth, itemHeigh);

        // Add a box
        const box = new Box(this, xOfItem * 6 + 50, yOfItem * 2 + 50, 'box');
        this.physics.add.collider(this.player.sprite, box.sprite, () => {
            if (this.player.sprite.body) {
                const velocity = new Phaser.Math.Vector2(
                    this.player.sprite.body.velocity.x,
                    this.player.sprite.body.velocity.y);
                box.push(velocity);
            } 
        });

        // Add a box two
        const boxTwo = new Box(this, 50, yOfItem * 3 + 50, 'box');
        this.physics.add.collider(this.player.sprite, boxTwo.sprite, () => {
            if (this.player.sprite.body) {
                const velocity = new Phaser.Math.Vector2(
                    this.player.sprite.body.velocity.x,
                    this.player.sprite.body.velocity.y);
                boxTwo.push(velocity);
            } 
        });

        // Stop the box when it hits a wall
        this.physics.add.collider(box.sprite, this.wallGroup, () => {
            box.stop(); // Stop the box's movement upon hitting a wall
        });

        // Stop the box two when it hits a wall
        this.physics.add.collider(boxTwo.sprite, this.wallGroup, () => {
            boxTwo.stop(); // Stop the box's movement upon hitting a wall
        });

        // Destroy the box and pit when they collide
        this.physics.add.overlap(box.sprite, this.pits, (_, pit) => {
            if (pit instanceof Phaser.GameObjects.GameObject) {
                box.handleCollisionWithPit(pit);
            }
        });

        // Destroy the box two and pit when they collide
        this.physics.add.overlap(boxTwo.sprite, this.pits, (_, pit) => {
            if (pit instanceof Phaser.GameObjects.GameObject) {
                boxTwo.handleCollisionWithPit(pit);
            }
        });

        // Add arrow
        this.arrow = this.add.image(xOfItem * 6 + 50, yOfItem * 6 + 50, "arrow")
        .setDisplaySize(itemWidth, itemHeigh);

        // Add pits
        this.pits = this.physics.add.group();
        this.pits.create(50, yOfItem * 4 + 50, 'pit')
        .setDisplaySize(itemWidth, itemHeigh).refreshBody();
        this.pits.create(xOfItem + 50, yOfItem * 3 + 50, 'pit')
        .setDisplaySize(itemWidth, itemHeigh).refreshBody();
        this.pits.create(xOfItem * 5 + 50, yOfItem * 3 + 50, 'pit')
        .setDisplaySize(itemWidth, itemHeigh).refreshBody();
        this.pits.create(xOfItem * 5 + 50, yOfItem * 4 + 50, 'pit')
        .setDisplaySize(itemWidth, itemHeigh).refreshBody();
        this.pits.create(xOfItem * 6 + 50, yOfItem * 3 + 50, 'pit')
        .setDisplaySize(itemWidth, itemHeigh).refreshBody();


        // Add a key
        const key = new Key(this, xOfItem * 5 + 50, yOfItem + 50, "key");

        // Add the key door
        const keyDoor = this.physics.add.staticSprite(xOfItem * 6 + 50, yOfItem * 5 + 50, "keyDoor")
        .setDisplaySize(itemWidth, itemHeigh);

        // Set up collision between the player and the key
        this.physics.add.collider(this.player.sprite, key.sprite, () => {
            key.collect(() => {
            // Destroy the key door when the key is collected
            keyDoor.destroy();
            console.log("Key collected, door opened!");
            });
        });

        // Add collision for the keyDoor (optional, if the door blocks the player)
        this.physics.add.collider(this.player.sprite, keyDoor);

        // Add stairs
        const stairs = this.physics.add.group({
            classType: Stair,
            runChildUpdate: true
        });
        stairs.add(new Stair(this, xOfItem * 2 + 50, yOfItem + 50, 'stair')
        .setDisplaySize(itemWidth, itemHeigh).refreshBody());
        stairs.add(new Stair(this, xOfItem * 5 + 50, yOfItem * 7 + 50, 'stair')
        .setDisplaySize(itemWidth, itemHeigh).refreshBody());

        // Create the menu button
        this.menuButton = new MenuButton(this, 100, yOfItem * 10 + 50, 'menuButton')
        .setDisplaySize(itemWidth * 2, itemHeigh * 2);
        this.add.existing(this.menuButton);

        // Create controls
        this.cursors = this.input!.keyboard!.createCursorKeys();
        if (this.input.keyboard) {
            this.cursors = this.input.keyboard.createCursorKeys();
        } else {
            console.error("Keyboard input is not available.");
        }

        // add red portal
        this.redPortal = this.add.image(xOfItem * 6 + 50, yOfItem * 7 + 50, "redPortal")
        .setDisplaySize(itemWidth, itemHeigh);

        // Enable physics on the red portal
        this.physics.add.existing(this.redPortal);

        // Add overlap detection between the player and the red portal
        this.physics.add.overlap(this.player.sprite, this.redPortal, () => {
            this.scene.start('GameOver'); // Transition to GameOver scene
        });
    }

    update() {
        this.player.update();
    }
}