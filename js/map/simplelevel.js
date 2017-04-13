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
        //this.game.scale.scaleMode = Phaser.ScaleManager.RESIZE;
        //TODO: load the background : should depend on the level name
        this.game.canvas.oncontextmenu = function (e) {
            e.preventDefault();
        }
        this._backgroundimg = this.add.tileSprite(-120, -120, 3200, 800, 'background');

        this.stage.backgroundColor = "#4488AA";
        this._map = this.add.tilemap('level-1');
        //this._map.addTilesetImage('basicTileset', 'basicTileset');  /// Old Config
        this._map.addTilesetImage('dom1', 'dom1');
        this._collision_layer = this._map.createLayer('CollisionLayer');
        this._background_layer = this._map.createLayer('BackLayer');
        this._collision_layer.resizeWorld();
    }

    _addPlayer(x, y) {
        var playerArr = this._findObjectsByType("PlayerStart", this._map, 'ObjectLayer');
        this.player = new Player(this.game, playerArr[0].x, playerArr[0].y);
    }
    _addEnemy() {
        this.enemies = this.add.group();
        var enemyArr = this._findObjectsByType("enemy", this._map, 'ObjectLayer');
        for (var i = 0; i < enemyArr.length; i++) {
            this.enemy = new Enemy(this.game, enemyArr[i].x, enemyArr[i].y);
            this.enemies.add(this.enemy);
            this.terminateCombat = this.enemy.events.endOfCombat.add(this._endCombatMode, this, 0);
        }
    }
    _addUserInterface() {
        this.userInterface = new userInterface(this.game);
    }
    _addSpells() {
            this._spells = new Spells(this.game, -50, -40, 10);
            console.log('spells Initialized');
            this.player.addChild(this._spells);
        }
        //   We use this to find and create objects from the json.
    _findObjectsByType(targetType, tilemap, layer) {
        var result = [];
        tilemap.objects[layer].forEach(function (element) {
            if (element.type == targetType) {
                result.push(element);
            }
        }, this);
        return result;
    }


    _ObjectsByTypeTest() {
        var enemyArray = this._findObjectsByName("Enemy", this._map, 'ObjectLayer');
        console.log(enemyArray);
    }

    _player_position_update() {
        var capturedPosition = this.player.body.x;
        this.enemies.forEach(function (enemy, enemies, player) {
            enemy._playerPositionX = capturedPosition;
        })

        this._spells._playerPositionX = this.player.x;
        this._spells._playerPositionY = this.player.y;

    }

    _enemyPlayerCollision(enemy, player) {
        this.enemy._enemyDamageTaken(90);
        this.userInterface._playerDamage(20);

    }
    _combatTestButton() {
        this.combatTestButton = this.game.add.sprite(780, 5, 'CombatMode');
        this.combatTestButton.fixedToCamera = true;
        this.combatTestButton.inputEnabled = true;
        this.combatTestButton.events.onInputDown.add(this._initCombatMode, this);
    }


    _initCombatMode(enemy) {
        if (this.combatModeEnabled === false) {
            this._spells._startCombatMode();
            this.player._combatModeEnabled();
            this.combatModeEnabled = true;
            enemy._CombatEngaged();
        } else {
            this._spells._endCombatMode();
            this.player._combat_mode_engaged = false;
            this.player._cursorReset();
            this.combatModeEnabled = false;

        }
    }
    _endCombatMode(enemy) {
        this.enemies.remove(enemy);
        this._spells._endCombatMode();
        this.player._combat_mode_engaged = false;
        this.player.deathEmitter.on = false;
        console.log('endcombatmode');
    }
    _enemyDamage(AttackSpell, enemy) {
        console.log('enemyHit!!');
        enemy.body.velocity.x = 0;
        enemy.body.velocity.y = 0;
        console.log(AttackSpell.damage);
        enemy._enemyDamageTaken(AttackSpell.damage);
        AttackSpell.kill();
    }


    _checkCollision() {
            this.game.physics.arcade.collide(this.enemies, this._collision_layer);
            //  this.game.physics.arcade.collide(this.enemies, this.player, this._enemyPlayerCollision, undefined, this);
            this.game.physics.arcade.collide(this.player, this._collision_layer);
            this.game.physics.arcade.collide(this.player.target, this._collision_layer);
            this.game.physics.arcade.collide(this._spells.AttackSpells, this.enemies, this._enemyDamage, undefined, this.enemy, this.AttackSpell);

        }
        //public methods :
        //@override:
    preload() {}
    create() {
        //set the physics
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        this._loadLevel();
        this.combatModeEnabled = false;
        this._addPlayer(0, 0);
        this._addEnemy();
        this._addSpells();
        this.game.camera.follow(this.player);
        //        //Everything on _collision_layer will collide
        this._map.setCollisionBetween(0, 160, true, this._collision_layer);
        //        this._map.setTileIndexCallback([33, 43, 51, 61], this.player.setOnLadder, this.player, this._ladder_layer);
        this._addUserInterface();

        this.spellArray = [
            [0, this._spells._manaBolt],
            [1, this._spells._manaShield],
            [2, this._spells._rainOfSpikes],
            [3, this._spells._counterSpell],
            [4, this._spells._manaBlast],
            [7, this._spells._retribution]
        ];
        this.spellSignal = this._spells.events.castSpell.add(this.player._castingAnimation, this.player, 0);

    }
    update() {
        this._backgroundimg.x = this.game.camera.x * 0.3;
        this._backgroundimg.y = this.game.camera.y * 0.3;
        this._checkCollision();
        this._player_position_update();

        this.enemies.forEachAlive(function (enemy, enemies, player) {
            if (this.player.x < enemy.x + 156 && this.player.x > enemy.x - 156 && this.player._combat_mode_engaged === false) {
                this._initCombatMode(enemy);
                console.log('proximity');

            }
        }, this);
        if (this.game.input.activePointer.rightButton.isDown) {
            this.player._fireSpell(600);
            //this._spells._fireSpell();
        }
    }
}







/*




    _enemy_hit(bullet, enemy) {

        bullet.kill();
        enemy._damageTaken(16);
        enemy.body.velocity.x = bullet.body.velocity.x / 8;
        enemy.body.velocity.y = bullet.body.velocity.y / 8;
        this.explosion.x = enemy.x;
        this.explosion.y = enemy.y;
        this.explosion.on = true;
        this.game.time.events.add(Phaser.Timer.SECOND * 0.3, this._endExplosion, this);
        if (enemy.health < 15 && enemy.alive) {
            this.userInterface._updateScore(20);
        }
    }
   this.game.physics.arcade.collide(this.player.bullets, this.enemies, this._enemy_hit, null, this);*/