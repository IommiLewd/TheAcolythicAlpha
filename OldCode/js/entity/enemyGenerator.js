/*
call with this faggot
           var mathRandom = Math.random() * (3 - 1) + 1;
            mathRandom = Math.round(mathRandom);
            this.monsterType = mathRandom;
*/


//create constructor input, monsterType 1-3. If undefined create random number from 1-3. This number will decide the monsters sprite and behaviour.

class enemyGenerator extends Phaser.Sprite {
    constructor(game, x, y, tilemap, monsterType) {
        super(game, x, y, tilemap, monsterType);
        if (monsterType === undefined) {
            var mathRandom = Math.random() * (3 - 1) + 1;
            mathRandom = Math.round(mathRandom);
            monsterType = mathRandom;
        }
        game.add.existing(this);
        game.physics.arcade.enable(this);
        this.anchor.setTo(0.5);
        this.game.physics.arcade.enableBody(this);
        this.body.collideWorldBounds = true;
        this.body.bounce.set(1, 0);
        this._map = game.add.tilemap('level-1');
        if (monsterType === 1) {
            //Flying Small Monster

            console.log(' firing monsterType ' + monsterType);
        }
        if (monsterType === 2) {
            //Standard medium monster
            console.log(' firing monsterType ' + monsterType);
        }
        if (monsterType === 3) {
            //Big Slow Monster
            console.log(' firing monsterType ' + monsterType);
        }
    }


    // Gather all movement info, related to the pertitent type of monster under its own function. Ideally 3 functions, each denoting the behaviour of each monster.

    _enemy_MovementReset() {
        if (this.body.x < this.horizontalCheck) {
            this.body.velocity.x = +130;
        } else {
            this.body.velocity.x = -130;
        }
        this.body.velocity.y = 0;
    }
    _vertical_update() {
        this.variableMovement = Math.random() * (150 - 20) + 20;
        if (this.body.y > this.heightCheck - 2) {
            this.body.velocity.y = this.variableMovement * -1 - 20;
        } else {
            this.body.velocity.y = this.variableMovement;
        }
    }


    _enemyHit() {
        console.log('EnemyHit Fired');
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

    }
}


/* _damage_animation() {
        this.animHandler = this.animations.play('MonsterDamage');
        this.animHandler = this.animations.currentAnim.onComplete.add(function () {
            this.animHandler = this.animations.play('Movement');
        }, this);
    }*/









/*



class enemyGenerator extends Phaser.Sprite {
    constructor(game, x, y, tilemap) {
        super(game, x, y, key, velocity, tilemap);
        if (velocity === undefined) {
            velocity = (Math.random() * 120 + 80) * (Math.random() < 0.5 ? 1 : -1);
        }
console.log(velocity);
        game.add.existing(this);
        game.physics.arcade.enable(this);
  
        this.anchor.setTo(0.5);
        this.game.physics.arcade.enableBody(this);
        this.body.collideWorldBounds = true;
        this.body.bounce.set(1, 0);
        this._health = health;
        this._map = game.add.tilemap('level-1');
        this.randomVelocity = velocity;
        this._player_Spotted = true;
        var seededTimer = Math.random() * (8 - 1) + 1;
        this.variableTimer = 0.4;
        this.game.time.events.add(Phaser.Timer.SECOND * seededTimer, this._engage_Velocity, this);
        this.body.allowGravity = false;
    this.game.time.events.loop(Phaser.Timer.SECOND * this.variableTimer, this._vertical_update, this);
        this.body.velocity.y = -90;
        this.animations.add('default', [0], 1, true);
         this.animations.add('damageTaken', [1], 1, true);
        this.animations.play('default');
                           
    }
    _engage_Velocity() {
        this.body.velocity.x = this.randomVelocity;
    }
    
    
// Gather all movement info, related to the pertitent type of monster under its own function. Ideally 3 functions, each denoting the behaviour of each monster.
    
    _enemy_MovementReset() {
        if (this.body.x < this.horizontalCheck) {
            this.body.velocity.x = +130;
        } else {
            this.body.velocity.x = -130;
        }
        this.body.velocity.y = 0;
    }
    _vertical_update () {
             this.variableMovement = Math.random() * (150 - 20) + 20;

       if(this.body.y > this.heightCheck - 2) {
           this.body.velocity.y = this.variableMovement * -1 - 20;
       }else {
            this.body.velocity.y = this.variableMovement;
       }
    }
  
    
    _enemyHit(){

        this.animations.play('damageTaken');
           this.game.time.events.add(Phaser.Timer.SECOND * 0.15, function () {
         this.animations.play('default');
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

    }
}


*/