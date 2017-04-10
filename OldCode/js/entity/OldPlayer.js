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
    constructor(game, posx, posy) {

        super(game, posx, posy, 'player', 0);
        this.anchor.setTo(0.5);
        this.animations.add('lookingRight', [4, 5, 6, 7], 11, true);
        this.animations.add('lookingLeft', [8, 9, 10, 11], 11, true);
        this.animations.add('standingArmed', [0, 1], 2, true);
        this.animations.add('standingUnarmed', [2], 2, true);
        this.animations.add('fly', [3], 11, true);
        game.add.existing(this);
        game.physics.arcade.enable(this);

        this.body.collideWorldBounds = true;
        //follow player with the camera
        this._combat_mode_engaged = false;
        this._ladder_mode = false;
        this._jump_timer = 0;
        //NOTE: this is bulletArc :
        this._recoil = 0;
        this._nextFire = 0;
        this._magazine_size = 40;
        this._total_ammo = 160;
        this._ammo = 40;
        this._initControl();
        this._initHealth(100);
        this._initCombat();
        this._reloading = false;
        this._playerFacingRight = true;
        this._activeEnemies = 11;
        this._enemiesInRound = 11;
        
    }

    _initControl() {
        this._left = this.game.input.keyboard.addKey(Phaser.Keyboard.A);
        this._right = this.game.input.keyboard.addKey(Phaser.Keyboard.D);
        this._up = this.game.input.keyboard.addKey(Phaser.Keyboard.W);
        this._down = this.game.input.keyboard.addKey(Phaser.Keyboard.S);
        this._combat_button = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        this._combat_button.onDown.add(this.toggleCombatMode, this);
         this._reload_button = this.game.input.keyboard.addKey(Phaser.Keyboard.R);
              this._reload_button.onDown.add(this._reload, this);

    }
    _initHealth(health) {
        //Add Healthbar
        this._health = health;
        this._health_bar = this.game.add.sprite(4, 3, 'healthBar');
        this._health_pixel = this.game.add.tileSprite(7, 6, 262, 10, 'redPixel');
        this._health_bar.bringToTop();
        this._health_pixel.bringToTop();
        this._health_bar.fixedToCamera = true;
        this._health_pixel.fixedToCamera = true;
    }
    _initCombat() {
        
            //CombatMode Indicator
            this._combat_marker = this.game.add.sprite(6, 22, 'combatEngaged');
            this._reloadImg = this.game.add.sprite(144, 22, 'reload');
            this._ammo_Box = this.game.add.sprite(774, 6, 'ammoBox');
            this._ammo_Counter = this.game.add.text(800, 10, this._ammo, {
                fill: "#e07723"
            });
            this._ammo_Counter.font = 'Press Start 2P';
            this._ammo_Counter.fontSize = 16;
            this._ammo_Counter.fixedToCamera = true;
            this._ammo_Box.fixedToCamera = true;
            this._reloadImg.fixedToCamera = true;
            this._reloadImg.alpha = 0.0;
            this._reloadProgress = this.game.add.tileSprite(244, 25, 26, 10, 'redPixel');
            this._reloadProgress.fixedToCamera = true;
            this._reloadProgress.alpha = 0.0;
            this._combat_marker.fixedToCamera = true;
            this._combat_marker.alpha = 0.0;
            //Create Laserpointer
            this._laser_pointer = this.game.add.tileSprite(0, 0, 800, 2, 'pointer');
            this._laser_pointer.anchor.setTo(0.0, 0.0);
            this.addChild(this._laser_pointer);
            this._laser_pointer.alpha = 0.0;
            //Load waveCounter
            this._waveCounter = this.game.add.sprite(277, 3, 'waveCounter');
            this._currentWave = this.game.add.text(345, 8, 0, {
                fill: "#e07723"
            });
            this._currentWave.font = 'Press Start 2P';
            this._currentWave.fixedToCamera = true;
            this._currentWave.fontSize = 16;
            this._totalWaves = this.game.add.text(362, 26, '3', {
                fill: "#e07723"
            });
            this._totalWaves.font = 'Press Start 2P';
            this._totalWaves.fontSize = 16;
            this._totalWaves.fixedToCamera = true;
            this._waveCounter.fixedToCamera = true;
            this.waveBar = this.game.add.sprite(276, 24, 'enemyCounterBar');
            this.waveBar.fixedToCamera = true;
            this.waveBarProgress = this.game.add.tileSprite(279, 27, 57, 3, 'redPixel');
            this.waveBarProgress.fixedToCamera = true;
            this.gunSprite = this.game.add.sprite(6, 0, 'Gun');
            this.gunSprite.anchor.setTo(0.5);
            this.addChild(this.gunSprite);
            this.gunSprite.alpha = 0.0;
        }
        /*
        _initPhysic(){

        }*/
        // COMBAT MODE :
    
    _enemyProgressUpdate(){
        this.waveBarProgress.width = this._activeEnemies / this._enemiesInRound * 57;
        console.log(this._enemiesInRound);
    }
    
    
    toggleCombatMode() {
        if (this._combat_mode_engaged === false && this._reloading === false) {
            this._canClimb = false;
            this._combat_mode_engaged = true;
            this._combat_marker.alpha = 1.0;
            this._laser_pointer.alpha = 0.2;
            this._combat_mode_engaged = true;
            this.gunSprite.alpha = 1.0;
        } else {
            if (this._reloading === false) {
                this._reloading = true;
                this._laser_pointer.alpha = 0.0;
                this._reload();

            }
        }
    }

    _reload() {
        this._reloadProgress.alpha = 1.0;
        this._reloadImg.alpha = 1.0;

        this._exampleTween = this.game.add.tween(this._reloadProgress).to({
            width: 0
        }, 1500, 'Linear', true);
         this._reloading = true;
        this.game.time.events.add(Phaser.Timer.SECOND * 1.6, this._reloadComplete, this);
    }

    _reloadComplete() {
            //this.game.tweens.remove(this._reloadProgress);
            this._reloadProgress.width = 26;
            this._combat_mode_engaged = false;
            this._ammo = this._magazine_size;
            this._combat_marker.alpha = 0.0;
            this._reloadImg.alpha = 0.0;
            this._reloading = false;
            this._canClimb = true;
            this._reloadProgress.alpha = 0.0;
            this._reloadProgress.width = 26;
            this.gunSprite.alpha = 0.0;
            this._ammo_Counter.setText(this._ammo);

        }
        // LADDER MODE :
    isOnLadder() {
        return this._ladder_mode;
    }
    resetLadderMode() {
        this._ladder_mode = false;
    }
    setOnLadder() {
        this._ladder_mode = true;
        this.game.time.events.add(Phaser.Timer.SECOND * 0.15, this.resetLadderMode, this);
    }


    //@override

    update() {
        
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
            this.gunSprite.scale.setTo(1, -1);
        }
        //on player actions :
        // moving cursor
        this._health_pixel.width = this._health / 100 * 262;
        //this._laser_pointer.rotation = this.game.physics.arcade.angleToPointer(this);
        this._laser_pointer.angle += +this._recoil;
        if (this.game.input.activePointer.isDown) {} else {
            if (this._recoil != 0) {
                this._recoil = 0.90 * this._recoil; //reduce recoil by 10%
            }
        }
        this.gunSprite.angle = this._laser_pointer.angle;


        //on the floor :
        if (this._left.isDown) {
            this.body.velocity.x = -260;
            if(this.body.onFloor()) {
                if(this._playerFacingRight) {
            this.animations.play('lookingLeft');
                } else {this.animations.play('lookingRight')};
                     } else {
                this.animations.play('fly');
            }
        } else if (this._right.isDown) {
            this.body.velocity.x = 260;
            if(this.body.onFloor()) {
                if(this._playerFacingRight) {
            this.animations.play('lookingRight');
                } else {
                    this.animations.play('lookingLeft');
                }
            } else {
                this.animations.play('fly');
            }
        } else {
            this.body.velocity.x = 0;
            if(this.body.onFloor()) {
                if(this._combat_mode_engaged){
            this.animations.play('standingArmed');
                } else {
                    this.animations.play('standingUnarmed');
                }
                               } else {
                this.animations.play('fly');
            }
        }

        //on jumping
        if (this._ladder_mode === false && this._up.isDown && this.body.onFloor() && this.game.time.now > this._jump_timer) {
            this.body.velocity.y = -240;
            this._jump_timer = this.game.time.now + 1150;
        }

        //on Ladder :
        if (this._ladder_mode === false || this._combat_mode_engaged === true) {
            this.game.physics.arcade.gravity.y = 360;
        } else {
            this.game.physics.arcade.gravity.y = 0;
            this.body.velocity.y = 0;
        }

        if (this._ladder_mode && this._up.isDown && this._combat_mode_engaged === false) {
            this.body.velocity.y = -170;
        }
        if (this._ladder_mode && this._down.isDown && this._combat_mode_engaged === false) {
            this.body.velocity.y = 170;
        }
        this.number = this._laser_pointer;
    }

}