/**
 * base class for a simple game level.
 *
 * @constructor  {}
 * @method   :
 * @property :
 * startPosition {} (x,y)
 */

class SimpleLevel extends Phaser.State {
    constructor() {
            super();
            // can be use later to identify tiles and tile_map
            // this.name = level_name;
        }
        // private methods :
    _loadLevel() {
        //TODO: load the background : should depend on the level name
        this.game.canvas.oncontextmenu = function (e) {
            e.preventDefault();
        }
        this.background = this.game.add.sprite(0, 0, 'background');
        this.background.fixedToCamera = true;
        this._map = this.add.tilemap('level-1');
        this._map.addTilesetImage('guntiles', 'tiles-1');
        //create layers
        this._back_tiles = this._map.createLayer('BackTiles');
        this._background_layer = this._map.createLayer('BackgroundLayer');
        this._collision_layer = this._map.createLayer('CollisionLayer');
        this._ladder_layer = this._map.createLayer('LadderLayer');
        this._front_layer = this._map.createLayer('ForegroundLayer');
        this._front_layer.bringToTop();
        this.game.world.sendToBack(this._background_layer);
        this.game.world.sendToBack(this._back_tiles);
        this.game.world.sendToBack(this.background);
        this._collision_layer.resizeWorld();
        this._initBullets();
        //Nextfire var is for the gun
        this._nextFire = 0;
        this.biteTimer = 0;
    }
    _initInterface() {
        this.userInterface = new userInterface(this.game);
    }

    _addPlayer(x, y) {
        var playerArr = this._findObjectsByType("player", this._map, 'ObjectLayer');
        this.player = new Player(this.game, playerArr[0].x, playerArr[0].y);
    }

    _addEnemies() {
        //Create Group enemies to handle collisions
        this.enemies = this.add.group();
        //Create Array to store all objects with the type 'enemy'
        var enemyArr = this._findObjectsByType('enemy', this._map, 'ObjectLayer');
        //For Each element in array create Enemy Instance
        enemyArr.forEach(function (element) {
            //this.enemy = new BasicEnemy(this.game, element.x, element.y, 'monster', undefined, this.map, 80);
            this.enemy = new floatingEnemy(this.game, element.x, element.y, 'monsterSmall', undefined, this.map, 80);

            this.enemies.add(this.enemy);

        }, this);

    }

    _player_position_update() {
            var capturedPosition = this.player.body.y;
            var capturedPosition2 = this.player.body.x;
            this.enemies.forEach(function (enemy, enemies, player) {
                enemy._playerPositionY = capturedPosition;
                enemy._playerPositionX = capturedPosition2;
            })
            if (this.player.world.x < this._positionEvaluator) {
                this.player._playerFacingRight = true;
            } else {
                this.player._playerFacingRight = false;
            }
        }
        //We use this to find and create objects from the json.
    _findObjectsByType(targetType, tilemap, layer) {
        var result = [];
        tilemap.objects[layer].forEach(function (element) {
            if (element.type == targetType) {
                result.push(element);
            }
        }, this);
        return result;
    }

    _player_damage(player, enemy) {
        console.log('player damage fired');
        this.game.time.events.add(Phaser.Timer.SECOND * 1, enemy._enemy_MovementReset, enemy);


        if (this.time.now > this.biteTimer) {
            this.game.camera.shake(0.06, 40);
            this.userInterface._player_health -= 14;
            this.biteTimer = this.time.now + 350;
            if(this.userInterface._player_health < 0) {
                this.userInterface._health_pixel.alpha = 0.0;
            }
        }


    }

    _enemy_hit(bullet, enemy) {
        console.log('enemyHit!');
        bullet.kill();
        enemy._enemyHit();
        enemy._health -= this._damage;
        console.log('enemy health is ' + enemy._health);
        enemy._enemy_MovementReset();
        if (enemy._health < 1) {
            enemy.kill();

        }

    }

    //Initializing Bullets
    _initBullets() {
            this.bullets = this.game.add.group();
            this.bullets.enableBody = true;
            this.bullets.physicsBodyType = Phaser.Physics.ARCADE;
            this.bullets.createMultiple(500, 'bullet');
            this.bullets.setAll('checkWorldBounds', true);
            this.bullets.setAll('outOfBoundsKill', true);
            this.bullets.setAll('anchor.x', 0.5);
            this.bullets.setAll('anchor.y', 0.5);
            //  --- Disable Gravity for Each Bullet
            this.bullets.forEach(function (L) {
                L.body.allowGravity = false;
            })
        }
        //Fire Weapon
    _fireWeapon(fireRate, damage, recoil) {
        if (this.player._energyShieldActive === false) {
            this.bullet;
            this._damage = damage;
            this.fireRate = fireRate;
            if (this.game.time.now > this._nextFire && this.bullets.countDead() > 3) {
                this._nextFire = this.game.time.now + this.fireRate;
                this.bullet = this.bullets.getFirstDead();
                this.bullet.reset(this.player._gunPosition.x, this.player._gunPosition.y);
                this.game.camera.shake(0.006, 30);
                if (this.player._playerFacingRight) {
                    this.game.physics.arcade.velocityFromAngle(this.player._laser_pointer.angle, 1100, this.bullet.body.velocity);
                } else {
                    this.game.physics.arcade.velocityFromAngle(this.player._laser_pointer.angle *= -1, 1100, this.bullet.body.velocity);
                }
                this.bullet.angle = this.player._laser_pointer.angle;
                this.bullet.bringToTop();
                this.bullets.add(this.bullet);
                this.player._fireAnimation();
            }
        }
    }
    _kill_bullet(bullet, _collision_layer) {
        //        this.testScorch = this.game.add.sprite(bullet.x, bullet.y, 'redPixel');
        //        this.testScorch.rotation = bullet.rotation;
        bullet.kill();
        //        console.log('Bullet X is ' + bullet.x + 'Bullet Y is ' + bullet.y);

    }






    _checkCollision() {
            this.physics.arcade.overlap(this.bullets, this._collision_layer, this._kill_bullet, function (bullet, _collision_layer) {
                return _collision_layer.collides;
            }, this);
            this.game.physics.arcade.collide(this.player, this._collision_layer);
            this.game.physics.arcade.collide(this.player, this._ladder_layer);
            this.game.physics.arcade.collide(this.enemies, this._collision_layer);
            this.game.physics.arcade.collide(this.player, this.enemies, this._player_damage, null, this);
            this.game.physics.arcade.collide(this.bullets, this.enemies, this._enemy_hit, null, this);
        }
        //public methods :
        //@override:
    preload() {}
    create() {
        //set the physics
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        this._loadLevel();
        this._front_layer.bringToTop();
        this._addPlayer(0, 0);
        this._addEnemies();
        this._initInterface();
        this.game.camera.follow(this.player);
        //Everything on _collision_layer will collide
        this._map.setCollisionBetween(0, 160, true, this._collision_layer);
        this._map.setTileIndexCallback([33, 43, 51, 61], this.player.setOnLadder, this.player, this._ladder_layer);

    }
    update() {
        this._positionEvaluator = this.game.input.activePointer.x + this.game.camera.x;
        this._checkCollision();

        //Fire Weapon RateofFire, Damage, Recoil. We eventually need to add , key here. for the bulletsprite.
        if (this.game.input.activePointer.leftButton.isDown && this.player._ladderMode === false) {
            this._fireWeapon(70, 3, 3); //Smg Settings (90, 6, 3)
            // this._fireWeapon(110, 8, 3); //Default for plasma Rifle, for now
        }


        if (this.game.input.activePointer.rightButton.isDown && this.player._ladderMode === false) {
            if (this.userInterface._player_energy > 5) {
                this._fireWeapon(4, 3, 3); //Smg Settings (90, 6, 3)
                this.userInterface._energy_regen = false;
                this.userInterface._player_energy--;
            }
        } else {
            this.player._energyShield.visible = false;
            this.player._energyShieldActive = false;
            this.userInterface._energy_regen = true;
        }
        this._player_position_update();

    }
}








/*
  _addEnemies() {
        //Create Group enemies to handle collisions
        this.enemies = this.add.group();
        //Create Array to store all objects with the type 'enemy'
        var enemyArr = this._findObjectsByType('enemy', this._map, 'ObjectLayer');
        //For Each element in array create Enemy Instance
        enemyArr.forEach(function (element) {
            this.enemy = new Enemy(this.game, element.x, element.y, 'monster', undefined, this.map, 80);
            //add enemy to enemies array
            this.amountOfEnemies++;
            this.enemies.add(this.enemy);

        }, this);

    }

    _enemy_hit(bullet, enemy) {
        enemy.animations.play('FastMovement');
        bullet.kill();
        enemy._health -= this._damage;

        enemy._enemy_MovementReset();
        enemy.body.velocity.y = 0;
        enemy._player_spotted = true;
        enemy._damage_animation();
        if (enemy._health < 1) {
            enemy.kill();
            this.player._activeEnemies--;
            this.player._enemyProgressUpdate();
            if (this.player._activeEnemies === 0) {
                console.log('arghblargh');
                this.amountOfEnemies = 0;

                this._monster_Spawner();
                this.player._activeEnemies = this.amountOfEnemies;
                this.player._enemiesInRound = this.amountOfEnemies;
                this.player._enemyProgressUpdate();
                console.log()

            }
        }


    }
    
    
    
        _enemy_hit(bullet, enemy) {

        bullet.kill();
        enemy._health -= this._damage;
        enemy._enemy_MovementReset();
        if (enemy._health < 1) {
            enemy.kill();
                console.log('enemyHit!);

            }
        }


    }
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
        _player_damage(player, enemy) {
        if (this.player._health < 1) {
            this.player._health = 0;
        } else if (this.time.now > this.biteTimer && this.player._health > 1) {
            this.game.camera.shake(0.06, 40);
            this.player._health -= 30;
            this.biteTimer = this.time.now + 450;
            enemy._enemy_MovementReset();
        }

        this.game.time.events.add(Phaser.Timer.SECOND * 1, enemy._enemy_MovementReset, enemy);
    }
*/




/*

    //  this.game.physics.arcade.overlap(this.bullet, this._collision_layer, this._kill_bullet, null, this);
           // this.game.physics.arcade.collide(this.player, this.enemies, this._player_damage, null, this);

            //this.game.physics.arcade.collide(this.enemies, this._collision_layer);
           // this.game.physics.arcade.collide(this.bullet, this.enemies, this._enemy_hit, null, this);











  _monster_Spawner() {
            this._current_wave++;
            this._waveModifier += 2;
            this.player._currentWave.setText(this._current_wave);
            console.log('MonsterSpawner Fired! Current Wave Count ' + this._current_wave);
            var spawnArr = this._findObjectsByType('MonsterSpawner', this._map, 'ObjectLayer');
            //For Each element in array create Enemy Instance
            for (this.r = 0; this.r < 4 + this._waveModifier; this.r++) {
                spawnArr.forEach(function (element) {
                    for (this.i = 0; this.i < 1; this.i++) {
                        this.enemy = new Enemy(this.game, element.x, element.y, 'monster', undefined, this.map, 80);
                        console.log('Enemy Added');
                    }
                       this.amountOfEnemies++;
                    //add enemy to enemies array
                    this.enemies.add(this.enemy);
                }, this);
            }
        }*/






/*


create() { // bullet group    APP.bullets = game.add.group();    APP.bullets.createMultiple(10, 'bullet');    APP.bullets.setAll('anchor.x', 0.5);    APP.bullets.setAll('anchor.y', 1);    // ensure that all bullets have physics, rather than setting individually    APP.bullets.enableBody = true;    APP.bullets.physicsBodyType = Phaser.Physics.ARCADE;}update(){if (APP.fireButton.isDown)        {            fireBullet();        }// Changed the overlap to check the layer against the whole group instead of// an individual global bullet reference which will keep changing.game.physics.arcade.overlap(APP.layer, APP.bullets, function(bullet, layer) {        bullet.kill();    }, null, this);}}function fireBullet() {    if (game.time.now > APP.bulletTime) {        //game.sound.play('fire');        APP.bulletTime = game.time.now + APP.bulletRate;        // Grab the first bullet we can from the pool that's dead (to ensure        // you don't accidentally grab bullets which are mid-flight)        var currentBullet = APP.bullets.getFirstDead();        if (currentBullet)        {            currentBullet.lifespan = 2000; // kill after 2000ms            if (APP.facing === "right") {                //  And fire it                currentBullet.reset(APP.player.x + 15, APP.player.y + 15);                currentBullet.body.velocity.x = APP.bulletvelocity;            }            else if (APP.facing === "left") {                currentBullet.reset(APP.player.x, APP.player.y + 15);                currentBullet.body.velocity.x = -APP.bulletvelocity;            }        }    }}*/