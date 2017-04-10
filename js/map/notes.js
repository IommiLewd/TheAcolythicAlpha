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
        this.stage.backgroundColor = "#4488AA";
        this._map = this.add.tilemap('level-1');
        this._map.addTilesetImage('basicTileset', 'basicTileset');
        this._collision_layer = this._map.createLayer('CollisionLayer');
        this._collision_layer.resizeWorld();
        this.roundCounter = 0;
    }

    _addPlayer(x, y) {
        this.player = new Player(this.game, 200, 200);
    }
    _addEnemy() {
        this.enemy = new Enemy(this.game, 800, 400);
    }
    _addUserInterface() {
        this.userInterface = new userInterface(this.game);
    }

    //We use this to find and create objects from the json.
    //    _findObjectsByType(targetType, tilemap, layer) {
    //        var result = [];
    //        tilemap.objects[layer].forEach(function (element) {
    //            if (element.type == targetType) {
    //                result.push(element);
    //            }
    //        }, this);
    //        return result;
    //    }

    _initCombatMode() {
        this.player._combatOverride();
        this.roundCounter++;
        console.log('Combat Initiated. Current round is: ' + this.roundCounter + ' ');
        this._myTween = this.game.add.tween(this.userInterface.timerBar).to({
            width: 220
        }, 3000, 'Linear', true);
        this._myTween.onComplete.add(this._battleCalculator, this);
    }

    _battleCalculator() {
        this.enemyRoll = Math.random() * (3 - 1) + 1;
        this.enemyRoll = Math.floor(this.enemyRoll);
        if (this.userInterface.actionSelected === 0) {
            console.log('You missed a Turn!');
        }
        if (this.userInterface.actionSelected === 1) {
            console.log('Attacking!');
        }
        if (this.userInterface.actionSelected === 2) {
            console.log('Defending!');
        }
        if (this.userInterface.actionSelected === 3) {
            console.log('Firing Spell 1!');
        }
        if (this.userInterface.actionSelected === 4) {
            console.log('Firing Spell 2!');
        }
        
        if (this.enemyRoll === 1) {
            // this.enemy._defend();
            console.log(' The enemy is defending!');
        }
        
        if (this.enemyRoll === 2) {
            // this.enemy._attack();
            console.log('The enemy is attacking!');
            if(this.userInterface._playerBlocking === false) {
                    this.userInterface._playerDamage(25);
            } else {
                console.log('Enemy Attack Blocked');
            }
        }
   
        this.userInterface.actionSelected = 0;
        this.userInterface.timerBar.width = 0;
        this._initCombatMode();
    }
    _checkCollision() {
            this.game.physics.arcade.collide(this.enemy, this._collision_layer);
            this.game.physics.arcade.collide(this.player, this._collision_layer);
            this.game.physics.arcade.collide(this.player.target, this._collision_layer);
        }
        //public methods :
        //@override:
    preload() {}
    create() {
        //set the physics
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        this._loadLevel();
        //        this._initcursor();
        this._addPlayer(0, 0);
        this._addEnemy();
        this.game.camera.follow(this.player);
        //        //Everything on _collision_layer will collide
        this._map.setCollisionBetween(0, 160, true, this._collision_layer);
        //        this._map.setTileIndexCallback([33, 43, 51, 61], this.player.setOnLadder, this.player, this._ladder_layer);
        this._addUserInterface();
    }
    update() {
        this._checkCollision();

        //              this.physics.arcade.overlap(this.bullets, this._collision_layer, this._kill_bullet, function (bullet, _collision_layer) {
        //                return _collision_layer.collides;
        //            }, this);

        if (this.player.x < this.enemy.x + 128 && this.player.x > this.enemy.x - 128 && this.player._combat_mode_engaged === false) {
            this._initCombatMode();

        }
    }
}