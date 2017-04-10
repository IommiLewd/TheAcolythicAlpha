class Preload extends Phaser.State {
    preload() {

        //this.load.script('webfont', '//ajax.googleapis.com/ajax/libs/webfont/1.4.7/webfont.js');

        // Images :
        this.load.spritesheet('player', 'img/playerSpriteSheet.png', 26, 60, 15);
        //this.load.image('shield', 'img/energyShield.png');
        this.load.spritesheet('shield', 'img/energyShieldTile.png', 40, 64, 4);
        this.load.image('background', 'img/backgroundImage.png');
        this.load.image('pointer', 'img/laserpointer.png');
        this.load.image('redPixel', 'img/redPixel.png');
        this.load.image('tiles-1', 'img/guntiles.png');
        this.load.image('bullet', 'img/bullet2.png');
        this.load.spritesheet('Gun', 'img/rifleTileset.png', 58, 14, 4);

        this.load.image('monster', 'img/monsterTemplate.png');
        // this.load.image('monsterSmall', 'img/monsterTemplateSmall.png');
        this.load.spritesheet('monsterSmall', 'img/monsterTemplateSmallTile.png', 62, 32, 2);
        this.load.image('monsterBig', 'img/monsterTemplateBig.png');

        // Ui Files
        this.load.image('healthBar', 'img/healthBar.png');
        this.load.image('energyBar', 'img/energyBar.png');
        this.load.image('healthPixel', 'img/healthPixel.png');
        this.load.image('energyPixel', 'img/energyPixel.png');


        // js scripts :
        this.load.script('player', 'js/entity/player.js');
        this.load.script('enemy', 'js/entity/enemy.js');
        this.load.script('simpleLevel', 'js/map/simplelevel.js');
        this.load.script('userInterface', 'js/entity/userInterface.js');
        this.load.script('floatingEnemy', 'js/entity/floatingEnemy.js')

        // json files :
        this.load.tilemap('level-1', 'json/mapOne.json', null, Phaser.Tilemap.TILED_JSON); //
    }
    create() {
        console.log("Preload.js:  Preload.create-> load_Level");
        this.game.state.add('SimpleLevel', SimpleLevel);
        this.game.state.start('SimpleLevel');
    }

}