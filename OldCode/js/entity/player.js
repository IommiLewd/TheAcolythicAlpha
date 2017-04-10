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
        this._initControl();
        this._initWeapons();
        this._initAnimations();
        this._playerFacingRight = false;
         this._energyShieldActive = false;
    }
    _initControl() {
        this._left = this.game.input.keyboard.addKey(Phaser.Keyboard.A);
        this._right = this.game.input.keyboard.addKey(Phaser.Keyboard.D);
        this._up = this.game.input.keyboard.addKey(Phaser.Keyboard.W);
        this._down = this.game.input.keyboard.addKey(Phaser.Keyboard.S);
        this._jump_timer = 0;
        this._ladderMode = false;
    }
    _initWeapons() {
        this._laser_pointer = this.game.add.tileSprite(0, -4, 800, 0.5, 'pointer');
        this._laser_pointer.anchor.setTo(0.0, 0.0);
        this.addChild(this._laser_pointer);
        this.gunSprite = this.game.add.sprite(20, 0, 'Gun');
        this.gunSprite.anchor.setTo(0.5);
        this._laser_pointer.addChild(this.gunSprite);
        this._laser_pointer.alpha = 1.0;
        
        //Energy Shield
        this._energyShield = this.game.add.sprite(40, 0, 'shield');
        this._energyShield.anchor.setTo(0.5);
        this._energyShield.visible = false;
        this._laser_pointer.addChild(this._energyShield);
       
      
        
    }
    _initAnimations() {
        this.animations.add('onLadder', [12], 6, true);
        this.animations.add('ladderUp', [12, 13, 14, 15], 6, true);
        this.animations.add('ladderDown', [15, 14, 13, 12], 7, true);
        this.animations.add('lookingRight', [4, 5, 6, 7], 7, true);
        this.animations.add('lookingLeft', [8, 9, 10, 11], 6, true);
        this.animations.add('standingArmed', [0, 1], 2, true);
        this.animations.add('standingUnarmed', [2], 2, true);
        this.animations.add('fly', [3], 11, true);
        this.gunSprite.animations.add('fire', [0, 1, 2, 3], 80, false);
        this.gunSprite.animations.add('standby', [3], 30, true);
        this.animations.play('standingArmed');
        this.gunSprite.animations.play('standby');
         this._energyShield.animations.add('shieldEffect', [0, 1, 2, 3], 15, true);
          this._energyShield.animations.play('shieldEffect');

    }
    _fireAnimation() {
    this.animhandler = this.gunSprite.animations.play('fire');
    }

    _facingEvaluator() {
        if (this._playerFacingRight) {
            this._laser_pointer.rotation = this.game.physics.arcade.angleToPointer(this);
            this._laser_pointer.scale.setTo(1, 1);
            this.scale.setTo(1, 1);
            this.gunSprite.scale.setTo(1, 1);
        } else {
            this._laser_pointer.rotation = this.game.physics.arcade.angleToPointer(this);
            this._laser_pointer.rotation *= -1;
            this.scale.setTo(-1, 1);
            this._laser_pointer.scale.setTo(-1, -1);
            this.gunSprite.scale.setTo(1, 1);
        }
    }
    _animationEvaluator() {
        if (this.body.onFloor()) {
            if (this._right.isDown) {
                if (this._playerFacingRight) {
                    this.animations.play('lookingRight')
                } else {
                    this.animations.play('lookingLeft')
                }
            } else if (this._left.isDown) {
                if (this._playerFacingRight) {
                    this.animations.play('lookingLeft')
                } else {
                    this.animations.play('lookingRight')
                }
            } else {
                this.animations.play('standingArmed');
            }
        } else if (this._ladderMode) {
            if (this._up.isDown) {
                this.animations.play('ladderUp');
            } else if (this._down.isDown) {
                this.animations.play('ladderDown');
            } else {
                this.animations.play('onLadder');
            }
        } else {
            this.animations.play('fly');
        }
    }

    setOnLadder() {
        if (this.x % 64 > 22 && this.x % 64 < 42) {
        if (this.body.onFloor() === false && this._up.isDown) {
            this._ladderMode = true;
            this._laser_pointer.alpha = 0.0;
            this.game.time.events.add(Phaser.Timer.SECOND * 0.1, function () {
                this._ladderMode = false;
                this._laser_pointer.alpha = 1.0;
            }, this);
        } else if (this.body.onFloor() && this._up.isDown) {
            this._ladderMode = true;
            this._laser_pointer.alpha = 0.0;
            this.game.time.events.add(Phaser.Timer.SECOND * 0.1, function () {
                this._ladderMode = false;
                this._laser_pointer.alpha = 1.0;
            }, this);
        }
    }}


    //@override
    update() {
        this._gunPosition = this.gunSprite.world;
        this._facingEvaluator();
        this._animationEvaluator();
        if (this._left.isDown) {
            this.body.velocity.x = -220;
        } else if (this._right.isDown) {
            this.body.velocity.x = 220;
        } else {
            this.body.velocity.x = 0;
        }
        if (this._up.isDown && this.body.onFloor() && this.game.time.now > this._jump_timer) {
            this.body.velocity.y = -240;
            this._jump_timer = this.game.time.now + 1150;
        }
        if (this._ladderMode) {
            this.game.physics.arcade.gravity.y = 0;
            if (this._up.isDown) {
                this.body.velocity.y = -110;
            } else if (this._down.isDown) {
                this.body.velocity.y = 110;
            } else {
                this.body.velocity.y = 0;
            }
        } else {
            this.game.physics.arcade.gravity.y = 360;
        }
    }
}