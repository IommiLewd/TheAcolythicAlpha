/**
 * base class for the player.
 * @constructor
 *  game : the phaser game.
 *  posx : his location in x.
 *  posy : his location in y.
 * @method toggleCombatMode
 *  change the player mode on Combat Mode.
 * @method reload
 *  TODO: reload the current weapon magazine
 * @property onLadder
 *  the player colliding with a ladder boolean.
 *  @getter : isOnLadder;
 *  @setTrue : setOnLadder;
 *  @reset : resetOnLadder
 * @method update :
 *
 */
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
        //this.animations.play('firing');
        //this.animations.play('walking');
        //this.animations.play('climbing');
        this.body.setSize(32, 48, 0, 0);
    }


    _initAnimations() {
        this.animations.add('standing', [0, 1, 2, 3, 4], 6, true);
        this.animations.add('firing', [5, 6, 7, 8, 9], 6, true);
        this.animations.add('walking', [10, 11, 12, 13, 14 ], 4, true);
        this.animations.add('climbing', [15, 16, 17, 18, 19], 6, true);


    }

    _initcursor() {
        this.cursor = this.game.add.group();
        this.cursor.enableBody = true;
        this.cursor.physicsBodyType = Phaser.Physics.ARCADE;
        this.cursor.setAll('body.collideWorldBounds', true);
    }


    _addNavigator() {
        if (this.game.time.now > this.inputTimer) {
            this.inputTimer = this.game.time.now + 800;
            if (this.navigatorAlive === false) {
                this.target = this.cursor.create(this.game.input.activePointer.worldX, this.game.input.activePointer.worldY, 'pointer');
                this.target.body.collideWorldBounds = true;
                this.target.body.bounce.set(0.2);
                this.navigatorAlive = true;
                this.target.anchor.setTo(0.5);
            } else {
                this.target.kill();
                this.target = this.cursor.create(this.game.input.activePointer.worldX, this.game.input.activePointer.worldY, 'pointer');
                this.target.body.collideWorldBounds = true;
                this.target.body.bounce.set(0.2);
                this.target.anchor.setTo(0.5);
            }
            console.log(this.game.input.activePointer.worldX);
            this._checkOrientation();
        }
    }

    
    _checkOrientation() {
        if (this.x < this.target.x) {
            this.body.velocity.x = 70;
            this.scale.setTo(-1, 1);
            if (this._climbing === false) {
                this.animations.play('walking');
            }
        }
        if (this.x > this.target.x) {
            this.body.velocity.x = -70;
            this.scale.setTo(1, 1);
            if (this._climbing === false) {
                this.animations.play('walking');
            }
        }
    }

    
    _movementReset() {
            this.body.velocity.x = 0;
            this.animations.play('standing');
        }
    
    
    
      _fireSpell(typeOf) {
        //_playeraction is true, update the movement system set vel to 0, destroy pointer, if 1-4 fire spell of this or that type.
          console.log('player firing spell');
    }
    
        //@override
    update() {
            if (this.game.input.activePointer.leftButton.isDown) {
                this.testcoordinate = this._map.getTileWorldXY(this.game.input.activePointer.worldX, this.game.input.activePointer.worldY, 64, 64, 'CollisionLayer');
                if (!this.testcoordinate) {
                    this._addNavigator();
                }
            }

            if (this.navigatorAlive === true) {
                if (this.x < this.target.x + 15 && this.x > this.target.x - 15) {
                    console.log('Arrived at Cursor');
                    this.target.kill();
                    this.navigatorAlive = false;
                    this.body.velocity.x = 0;
                    this.animations.play('standing');
                }
            }


            if (this.body.blocked.right) {
                this.body.velocity.y = -60;
                this.animations.play('climbing');
                this._climbing = true;
                this._checkOrientation();
            } else if (this.body.blocked.left) {
                this.body.velocity.y = -60;
                this.animations.play('climbing');
                this._climbing = true;
                this._checkOrientation();
            } else {
                this._climbing = false;
                if (this.navigatorAlive) {
                    this.animations.play('walking');
                }
            }
    }
}