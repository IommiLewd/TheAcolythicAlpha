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
class Enemy extends Phaser.Sprite {
    constructor(game, posx, posy, tilemap) {
        super(game, posx, posy, 'player', 0);
        game.add.existing(this);
        game.physics.arcade.enable(this);
        this.body.collideWorldBounds = true;
        this.game.physics.arcade.gravity.y = 360;
        this.anchor.setTo(0.5);
        this._map = game.add.tilemap('level-1');
        this._health = 100;
        this._initHealthIndicator();
        this.startPos = this.body.x;
        this._playerSpotted = false;
        this.body.velocity.x = 40;
        this.body.bounce.set(1, 0);
        this._playerPositionX;
        this._enemyHealth = 100;
        this._combatMode = false;
        this._initAnimations();
        this.animations.play('walking');
    }

    _initHealthIndicator() {
        this.healthBar = this.game.add.tileSprite(0, -56, 76, 16, 'DHPixel');
        this.healthBar.anchor.setTo(0.5);
        this.addChild(this.healthBar);
        this.healthStatus = this.game.add.tileSprite(-35, -56, 70, 10, 'HPixel');
        this.healthStatus.anchor.setTo(0.0, 0.5);
        this.addChild(this.healthStatus);
        this.healthBar.visible = false;
        this.healthStatus.visible = false;

    }

    _CombatEngaged() {
        this.healthBar.visible = true;
        this.healthStatus.visible = true;
        this._combatMode = true;
        this.animations.play('standing');
    }

    _initAnimations() {
        this.animations.add('standing', [0, 1, 2, 3, 4], 5, true);
        this.animations.add('firing', [5, 6, 7, 8, 9], 6, true);
        this.animations.add('walking', [10, 11, 12, 13, 14], 5, true);
        this.animations.add('climbing', [15, 16, 17, 18, 19], 6, true);
    }
    _enemyDamageTaken(damage) {
        //    this.game.time.events.add(Phaser.Timer.SECOND * 0.35, this._enemy_MovementReset, this);
        this._enemyHealth -= damage;
        this.healthStatus.width = this._enemyHealth / 100 * 70;
        if (this._enemyHealth < 0) {
            this.kill();
        }
    }

    update() {

        if (this._combatMode === false) {
            var direction;
            if (this.body.velocity.x > 0) {
                this.scale.setTo(-1, 1);
                direction = 1;
            } else {
                this.scale.setTo(1, 1);
                direction = -1;
            }

            console.log
            var nextX = this.x + direction * (Math.abs(this.width) / 2 + 1 + 128);
            var nextY = this.bottom + 1;
            var nextTile = this._map.getTileWorldXY(nextX, nextY, 64, 64, 'CollisionLayer');
            if (!nextTile && this.body.blocked.down) {
                this.body.velocity.x *= -1;
            }


        } else {this.body.velocity.x = 0}
    }
}