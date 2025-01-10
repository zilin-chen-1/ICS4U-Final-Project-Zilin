import { Scene, GameObjects } from 'phaser';

export class MainMenu extends Scene
{
    background: GameObjects.Image;
    logo: GameObjects.Image;
    title: GameObjects.Text;

    constructor ()
    {
        super('MainMenu');
    }

    create ()
    {
        const gameWidth = this.scale.width;
        const gameHeight = this.scale.height;

        this.background = this.add.image(0 ,0, 'titleBackground')
        .setOrigin(0, 0)
        .setDisplaySize(gameWidth, gameHeight);

        this.logo = this.add.image(gameWidth / 2, gameHeight / 2, 'logo');

        this.title = this.add.text(gameWidth / 2, gameHeight / 2 + 50, 'start', {
            fontFamily: 'cursive', fontSize: 200, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5);

        this.input.once('pointerdown', () => {

            this.scene.start('LevelOne');

        });
    }
}
