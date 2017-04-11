class Player extends Phaser.Sprite {
    constructor(game, posx, posy, tilemap) {
        super(game, posx, posy, 'player', 0);
        game.add.existing(this);
        game.physics.arcade.enable(this);
        this.body.collideWorldBounds = true;
        this.game.physics.arcade.gravity.y = 360;
        this.anchor.setTo(0.5);
        this._initcursor();
        this.navigatorAlive = false;
        this.inputTimer = 0;
        this.anchor.setTo(0.5);
        this._map = game.add.tilemap('level-1');
        this._combat_mode_engaged = false;
        this._initAnimations();
        this.animations.play('standing');

        this.body.setSize(32, 48, 0, 0);
        this.spellFiring = false;
        this._initAttackSpells();
        this._nextFire = 0;
        this._spellDuration = 600;
        console.log('wuzzarp');
        
    }


    _initAnimations() {
        this.animations.add('standing', [0, 1, 2, 3, 4], 6, true);
        this.animations.add('firing', [5, 6, 7, 8, 9], 6, true);
        this.animations.add('walking', [10, 11, 12, 13, 14], 4, true);
        this.animations.add('climbing', [15, 16,/* 17, 18, */19], 6, true);
                //this.animations.play('firing');
        //this.animations.play('walking');
        //this.animations.play('climbing');
    }

    _initcursor() {
        this.cursor = this.game.add.group();
        this.cursor.enableBody = true;
        this.cursor.physicsBodyType = Phaser.Physics.ARCADE;
        this.cursor.setAll('body.collideWorldBounds', true);
    }

    _addNavigator() {
        this.target = this.cursor.create(this.game.input.activePointer.worldX, this.game.input.activePointer.worldY, 'pointer');;
        this.target.body.bounce.set(0.2);
        this.navigatorAlive = true;
        this.target.anchor.setTo(0.5);
    }

    _cursorReset() {
        this.target.destroy();
        this.navigatorAlive = false;
    }



    //@override
    update() {

        if (this.navigatorAlive === true) {
            if (this.x < this.target.x + 15 && this.x > this.target.x - 15) {
                this._cursorReset();
            }
        }
        if (this.game.input.activePointer.leftButton.isDown && this.game.time.now > this.inputTimer && this._combat_mode_engaged === false) {
            this.inputTimer = this.game.time.now + 200;
            this.testcoordinate = this._map.getTileWorldXY(this.game.input.activePointer.worldX, this.game.input.activePointer.worldY, 64, 64, 'CollisionLayer');
            if (!this.testcoordinate && this.navigatorAlive === false) {
                this._addNavigator();
            } else if (!this.testcoordinate) {
                this._cursorReset();
                this._addNavigator();
            }
        }

        if (this.navigatorAlive) {
            if (this.x < this.target.x) {
                this.body.velocity.x = 70;
                this.scale.setTo(-1, 1);
                if (this.body.blocked.right) {
                    this.body.velocity.y = -60;
                    this.animations.play('climbing');
                } else {
                    this.animations.play('walking');
                }
            }
            if (this.x > this.target.x) {
                this.body.velocity.x = -70;
                this.scale.setTo(1, 1);
                if (this.body.blocked.left) {
                    this.body.velocity.y = -60;
                    this.animations.play('climbing');
                } else {
                    this.animations.play('walking');
                }
            }
        } else if (this.spellFiring) {
            this.body.velocity.x = 0;
            this.animations.play('firing');
        } else {
            this.body.velocity.x = 0;
            this.animations.play('standing');
        }
    }
}