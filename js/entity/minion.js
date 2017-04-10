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
class Minion extends Phaser.Sprite {
    constructor(game, posx, posy, tilemap) {
        super(game, posx, posy, 'enemy', 0);
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
        this.body.velocity.x = 20;
        this.body.bounce.set(1, 0);
        this._playerPositionX;
        this._enemyHealth = 100;
    }

    _initHealthIndicator() {
        this.healthBar = this.game.add.tileSprite(0, -56, 76, 16, 'DHPixel');
        this.healthBar.anchor.setTo(0.5);
        this.addChild(this.healthBar);
        this.healthStatus = this.game.add.tileSprite(-35, -56, 70, 10, 'HPixel');
        this.healthStatus.anchor.setTo(0.0, 0.5);
        //this.healthStatus.anchor.setTo(0.5);
        this.addChild(this.healthStatus);

    }

    _displayHealthIndicator() {

    }

    _enemy_MovementReset() {
        if (this.body.x < this._playerPositionX) {
            this.body.velocity.x = +80;
        } else {
            this.body.velocity.x = -80;
        }
        this.body.velocity.y = 0;
    }


    _enemyDamageTaken(damage) {
            this.body.velocity.x = 150;
            this.body.velocity.y = -50;
            this.game.time.events.add(Phaser.Timer.SECOND * 0.35, this._enemy_MovementReset, this);
        this._enemyHealth -= damage;
          this.healthStatus.width  = this._enemyHealth / 100 * 70;
        if(this._enemyHealth < 0){ this.kill();}
        }
        //@override
    update() {


        if (this._playerPositionX < this.x + 180 && this._playerPositionX > this.x - 180 && this._playerSpotted === false) {
            this._enemy_MovementReset();
            this._playerSpotted = true;
        }
        if (this._playerSpotted === false) {
            var direction;
            if (this.body.velocity.x > 0) {
                this.scale.setTo(-1, 1);
                direction = 1;
            } else {
                this.scale.setTo(1, 1);
                direction = -1;
            }
            var nextX = this.x + direction * (Math.abs(this.width) / 2 + 1);
            var nextY = this.bottom + 1;
            var nextTile = this._map.getTileWorldXY(nextX, nextY, 64, 64, 'CollisionLayer');
            if (!nextTile && this.body.blocked.down) {
                this.body.velocity.x *= -1;
            }
        }
    }
}