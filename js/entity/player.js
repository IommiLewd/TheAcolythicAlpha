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
        this.spellFiring = false;
        this._initAttackSpells();
        this._nextFire = 0;
        this._spellDuration = 600;
        
    }


    _initAnimations() {
        this.animations.add('standing', [0, 1, 2, 3, 4], 6, true);
        this.animations.add('firing', [5, 6, 7, 8, 9], 6, true);
        this.animations.add('walking', [10, 11, 12, 13, 14], 4, true);
        this.animations.add('climbing', [15, 16, 17, 18, 19], 6, true);
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

    _fireSpell(typeOf) {
        this.AttackSpell;
        if (this.game.time.now > this._nextFire) {
            this._nextFire = this.game.time.now + this._spellDuration;
        this._cursorReset();
        console.log('player firing spell');
        //this.animations.play('firing');
        this.spellFiring = true;

        this.AttackSpell = this.AttackSpells.getFirstDead();
        this.AttackSpell.reset(this.x, this.y);
        this.AttackSpell.body.velocity.x = 1100;
        this.game.time.events.add(Phaser.Timer.SECOND * 0.6, function () {
            this.spellFiring = false;
        }, this);
    }}

    _fireWeapon() {
        this.bullet;
        if (this.game.time.now > this._nextFire) {
            if (this.currentTurret >= this.turretGroup.length) {
                this.currentTurret = 0;
            }
            this._nextFire = this.game.time.now + this.turretArray[this.currentTurret][7];
            this.bullet = this.bullets.getFirstDead();
            this.fireIndicator.frame = 0;
            this.bullet.reset(this.turretGroup.children[this.currentTurret].world.x, this.turretGroup.children[this.currentTurret].world.y);
            this.game.camera.shake(0.004, 40);
            var testRotation = this.turretGroup.children[this.currentTurret].rotation += this.rotation;
            this.game.physics.arcade.velocityFromRotation(testRotation, this.turretArray[this.currentTurret][6], this.bullet.body.velocity);
            this.bullet.angle = this.turretGroup.children[this.currentTurret].angle;
            this.textGroup.children[this.currentTurret].fill = '#ff1515';
            this.bullet.frame = this.turretArray[this.currentTurret][5];
            var rateOfindicator = this.turretArray[this.currentTurret][7] / 1000;
            var temporary = this.currentTurret;
            this.game.time.events.add(Phaser.Timer.SECOND * rateOfindicator, function () {
                this.fireIndicator.frame = 1;
                this.textGroup.children[temporary].fill = '#f27519';

            }, this);
            this.currentTurret++;
            this.bullet.bringToTop();
            this.bullets.add(this.bullet);

        }
    }





    _initAttackSpells() {
        this.AttackSpells = this.game.add.group();
        this.AttackSpells.enableBody = true;
        this.AttackSpells.physicsBodyType = Phaser.Physics.ARCADE;
        this.AttackSpells.createMultiple(50, 'bullet');
        this.AttackSpells.setAll('checkWorldBounds', true);
        this.AttackSpells.setAll('outOfBoundsKill', true);
        this.AttackSpells.setAll('anchor.x', 0.5);
        this.AttackSpells.setAll('anchor.y', 0.5);
        //  --- Disable Gravity for Each Bullet
        this.AttackSpells.forEach(function (L) {
            L.body.allowGravity = false;

        })
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