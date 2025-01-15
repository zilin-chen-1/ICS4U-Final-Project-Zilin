/*
* This is player program
*
* @author Zilin
* @version 1.0
* @since 2025-01-09
*/
import Phaser from "phaser";

export default class Player {
  private sprite: Phaser.Physics.Arcade.Sprite;
  private scene: Phaser.Scene;

  constructor(scene: Phaser.Scene, x: number, y: number, texture: string) {
    this.scene = scene;
    this.sprite = scene.physics.add.sprite(x, y, texture);
    this.sprite.setCollideWorldBounds(true);
  }

  public update() {
    const keyboard = this.scene.input?.keyboard;
    if (!keyboard) return;

    const cursors = keyboard.createCursorKeys();
    const wasd = keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      right: Phaser.Input.Keyboard.KeyCodes.D,
    }) as { [key: string]: Phaser.Input.Keyboard.Key };

    if (cursors.left?.isDown || wasd.left.isDown) {
      this.sprite.setVelocityX(-150);
    } else if (cursors.right?.isDown || wasd.right.isDown) {
      this.sprite.setVelocityX(150);
    } else {
      this.sprite.setVelocityX(0);
    }

    if (cursors.up?.isDown || wasd.up.isDown) {
      this.sprite.setVelocityY(-150);
    } else if (cursors.down?.isDown || wasd.down.isDown) {
      this.sprite.setVelocityY(150);
    } else {
      this.sprite.setVelocityY(0);
    }
  }

  public handleInteractions(
    stairs: Phaser.Physics.Arcade.Group,
    rocks: Phaser.Physics.Arcade.Group,
    boxes: Phaser.Physics.Arcade.Group,
    pits?: Phaser.Physics.Arcade.Group
  ) {
    // Teleport between stairs
    this.scene.physics.add.overlap(this.sprite, stairs, (player, stair) => {
      const otherStair = stairs.getChildren().find((s) => s !== stair);
      if (otherStair) {
        (player as Phaser.Physics.Arcade.Sprite).setPosition(
          (otherStair as Phaser.GameObjects.Sprite).x,
          (otherStair as Phaser.GameObjects.Sprite).y
        );
      }
    });

    // Handle rocks
    this.scene.physics.add.collider(this.sprite, rocks, (player, rock) => {
      const playerBody = (player as Phaser.Physics.Arcade.Sprite)?.body;
      if (!playerBody) return;

      const velocity = playerBody.velocity;
      (rock as Phaser.Physics.Arcade.Sprite).setVelocity(velocity.x, velocity.y);
    });

    // Handle boxes and pits
    if (pits) {
      this.scene.physics.add.collider(this.sprite, boxes, (player, box) => {
        const playerBody = (player as Phaser.Physics.Arcade.Sprite)?.body;
        if (!playerBody) return;

        const velocity = playerBody.velocity;
        const boxSprite = box as Phaser.Physics.Arcade.Sprite;
        boxSprite.setVelocity(velocity.x, velocity.y);

        // Check for overlap with pits
        this.scene.physics.add.overlap(boxSprite, pits, () => {
          boxSprite.destroy();
          pits.getChildren().forEach((pit) => {
            const pitSprite = pit as Phaser.Physics.Arcade.Sprite;
            if (this.scene.physics.overlap(boxSprite, pitSprite)) {
              pitSprite.destroy();
            }
          });
        });
      });
    }
  }
}