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
class Spells extends Phaser.Sprite {
    constructor(game, posx, posy, damage) {
        super(game, posx, posy, 'shield', 0);
        game.add.existing(this);
        game.physics.arcade.enable(this);
        this.body.checkWorldBounds = true;
        this.body.outOfBoundsKill = true;
        // this.anchor.setTo(0.5);
        //this._map = game.add.tilemap('level-1');
        this._playerPositionX;
        this._playerPositionY;
        this.body.allowGravity = false;


        this.bullet;
        this._damage = damage;
        this.visible = false;
        this.spellArray = [
            [0, this._manaBolt],
            [1, this._manaShield],
            [2, this._rainOfSpikes],
            [3, this._counterSpell],
         [5, this._manaBlast],
          [5, this._retribution]

        ];
        this._spellSelection();
        this._initProjectileAttacks();
        this.spellLevel = 1;
    }
    _startCombatMode() {


    }

    _spellSelection() {
        this.slotDistance = 10;
        for (var i = 0; i < this.spellArray.length; i++) {
            console.log('shazbot');
            this.spellSlot = this.game.add.image(this.slotDistance, 488, 'SpellSlot');
            this.spellSlot.fixedToCamera = true;
            this.spellIcon = this.game.add.image(this.slotDistance + 10, 498, 'spellIcons');
            this.spellIcon.fixedToCamera = true;
            this.slotDistance += 72;
            this.spellIcon.frame = [i][0];
            this.spellIcon.inputEnabled = true;
            let testVar = this.spellArray[i][1];
            this.spellIcon.events.onInputDown.add(testVar, this);
        }
    }
    _fireSpell() {
        console.log('_fireSpell Triggered');
        // this.bullet.reset(this._playerPositionX, this._playerPositionY);
        // this.bullet = this.bullets.getFirstDead();
    }

    _manaBolt() {
        console.log('manaboltttttt');
        this.damage = 3;
        var stagger = 0.2;
        
        //        this.AttackSpell = this.AttackSpells.getFirstDead();
        //        this.AttackSpell.reset(this._playerPositionX, this._playerPositionY);
        //
        //        this.AttackSpell.body.velocity.x = 1100;
        //        this.AttackSpell.frame = 0;
        for (var i = 0; i < 2 + this.spellLevel; i++) {




            this.game.time.events.add(Phaser.Timer.SECOND * stagger, function () {

                this.AttackSpell = this.AttackSpells.getFirstDead();
                this.AttackSpell.reset(this._playerPositionX + stagger + 30, this._playerPositionY + stagger);
                this.AttackSpell.body.velocity.x = 900;
                this.AttackSpell.frame = 0;

            }, this);

            stagger += 0.1;
        }
    }
    _manaShield() {
        console.log('Manashieldddd Yisss');
        if (this.visible) {
            this.visible = false;
        } else {
            this.visible = true;
        }

    }
    _rainOfSpikes() {
        this.damage = 2;
        console.log('RainOvSpikes');
        var dog = 12;
        for (var i = 0; i < 4 + this.spellLevel; i++) {
            this.AttackSpell = this.AttackSpells.getFirstDead();
            this.AttackSpell.reset(this._playerPositionX + 122 + dog, 80 - dog);
            this.AttackSpell.body.velocity.y = 400 + dog;
            this.AttackSpell.frame = 1;
            // this.AttackSpell.body.acceleration.y += 4;
            dog += 12;
            if (i === 4) {

            }
        }
    }
    _counterSpell() {
        console.log('CounterSpell!');
//        this.AttackSpell = this.AttackSpells.getFirstDead();
//        this.AttackSpell.reset(this._playerPositionX, this._playerPositionY - 54);
//        this.AttackSpell.frame = 4;
////        this.AttackSpell.scale.setTo(2.0);
//        this.AttackSpell.scale.setTo(2.0, 2.0);
//    this.myTween = this.game.add.tween(this.AttackSpell).to( { alpha: 0.0 }, 2000, Phaser.Easing.Linear.None, true, 0, 1000, false);
//        this.myTween.onComplete.add(function(){  this.AttackSpell.kill();},this);
//           this.game.time.events.add(Phaser.Timer.SECOND * 2, function () {
//               this.AttackSpell.kill();
//       }, this);
           //this.game.add.tween(this.AttackSpell.scale).to({ scale: 6.0 }, 2000, Phaser.Easing.Linear.None, true, 0, 1000, true);
    }

    _manaBlast() {
        console.log('ManaBlast!');
        this.damage = 3;
        this.AttackSpell = this.AttackSpells.getFirstDead();
        this.AttackSpell.reset(this._playerPositionX, this._playerPositionY);
        this.AttackSpell.body.velocity.x = 500;
        this.AttackSpell.frame = 2;
     
    }

    _retribution() {
        console.log('retribution!');
    }


    _initProjectileAttacks() {
        this.AttackSpells = this.game.add.group();
        this.AttackSpells.enableBody = true;
        this.AttackSpells.physicsBodyType = Phaser.Physics.ARCADE;
        this.AttackSpells.createMultiple(50, 'bulletTiles');
        this.AttackSpells.setAll('checkWorldBounds', true);
        this.AttackSpells.setAll('outOfBoundsKill', true);
        this.AttackSpells.setAll('anchor.x', 0.5);
        this.AttackSpells.setAll('anchor.y', 0.5);
        //  --- Disable Gravity for Each Bullet
        this.AttackSpells.forEach(function (L) {
            L.body.allowGravity = false;

        })
    }

    update() {

    }
}






//            this.AttackSpell = this.AttackSpells.getFirstDead();
//            this.AttackSpell.reset(this.x, this.y);
//            this.AttackSpell.body.velocity.x = 1100;






//    _fireWeapon() {
//        this.bullet;
//        if (this.game.time.now > this._nextFire) {
//            if (this.currentTurret >= this.turretGroup.length) {
//                this.currentTurret = 0;
//            }
//            this._nextFire = this.game.time.now + this.turretArray[this.currentTurret][7];
//            this.bullet = this.bullets.getFirstDead();
//            this.fireIndicator.frame = 0;
//            this.bullet.reset(this.turretGroup.children[this.currentTurret].world.x, this.turretGroup.children[this.currentTurret].world.y);
//            this.game.camera.shake(0.004, 40);
//            var testRotation = this.turretGroup.children[this.currentTurret].rotation += this.rotation;
//            this.game.physics.arcade.velocityFromRotation(testRotation, this.turretArray[this.currentTurret][6], this.bullet.body.velocity);
//            this.bullet.angle = this.turretGroup.children[this.currentTurret].angle;
//            this.textGroup.children[this.currentTurret].fill = '#ff1515';
//            this.bullet.frame = this.turretArray[this.currentTurret][5];
//            var rateOfindicator = this.turretArray[this.currentTurret][7] / 1000;
//            var temporary = this.currentTurret;
//            this.game.time.events.add(Phaser.Timer.SECOND * rateOfindicator, function () {
//                this.fireIndicator.frame = 1;
//                this.textGroup.children[temporary].fill = '#f27519';
//
//            }, this);
//            this.currentTurret++;
//            this.bullet.bringToTop();
//            this.bullets.add(this.bullet);
//        }
//    }
//
//    _initProjectileAttacks() {
//        this.AttackSpells = this.game.add.group();
//        this.AttackSpells.enableBody = true;
//        this.AttackSpells.physicsBodyType = Phaser.Physics.ARCADE;
//        this.AttackSpells.createMultiple(50, 'bullet');
//        this.AttackSpells.setAll('checkWorldBounds', true);
//        this.AttackSpells.setAll('outOfBoundsKill', true);
//        this.AttackSpells.setAll('anchor.x', 0.5);
//        this.AttackSpells.setAll('anchor.y', 0.5);
//        //  --- Disable Gravity for Each Bullet
//        this.AttackSpells.forEach(function (L) {
//            L.body.allowGravity = false;
//
//        })
//    }