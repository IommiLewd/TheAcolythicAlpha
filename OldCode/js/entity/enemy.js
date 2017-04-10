class BasicEnemy extends Phaser.Sprite {
    constructor(game, x, y, key, velocity, tilemap, health) {
        super(game, x, y, key, velocity, tilemap);
        if (velocity === undefined) {
            velocity = (60 + Math.random() * 20) * (Math.random() < 0.5 ? 1 : -1);
        }

        game.add.existing(this);
        game.physics.arcade.enable(this);
        this.anchor.setTo(0.5);
        this.game.physics.arcade.enableBody(this);
        this.body.collideWorldBounds = true;
        this.body.bounce.set(1, 0);
        this._health = 80;
        this._map = game.add.tilemap('level-1');
        this.randomVelocity = velocity;
        this._player_Spotted = true;
        var seededTimer = Math.random() * (8 - 1) + 1;
        this.game.time.events.add(Phaser.Timer.SECOND * seededTimer, this._engage_Velocity, this);
   
        //this.body.allowGravity = false;
    }
    _engage_Velocity() {
        this.body.velocity.x = this.randomVelocity;
    }
    _enemy_MovementReset() {
        if (this.body.x < this.horizontalCheck) {
            this.body.velocity.x = +180;
        } else {
            this.body.velocity.x = -180;
        }
    }

    _damage_animation() {
        this.animHandler = this.animations.play('MonsterDamage');
        this.animHandler = this.animations.currentAnim.onComplete.add(function () {
            this.animHandler = this.animations.play('Movement');
        }, this);
    }
    update() {
        this.heightCheck;
        this.horizontalCheck;
        if (this._playerPositionY === undefined && this._playerPositionX === undefined) {} else {
            this.heightCheck = this._playerPositionY;
            this.horizontalCheck = this._playerPositionX;
        }
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
            if (!nextTile && this.body.blocked.down && this.y > this.heightCheck - 6) {
                this.body.velocity.x *= -1;
            
        }
    }
}