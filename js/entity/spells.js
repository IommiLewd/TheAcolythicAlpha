class Spells extends Phaser.Sprite {
    constructor(game, posx, posy, damage) {
        super(game, posx, posy, 'shield', 0);
        game.add.existing(this);
        game.physics.arcade.enable(this);
        this.body.checkWorldBounds = true;
        this.body.outOfBoundsKill = true;
        this._initProjectileAttacks();
        this.spellLevel = 1;
        this._playerPositionX = 100;
        this._playerPositionY = 100;
        this.body.allowGravity = false;
        this.spellSlotGroup = this.game.add.group();
        this._damage = damage;
        this.spellArray = [
            [0, this._manaBolt],
//            [1, this._manaShield],
            [2, this._rainOfSpikes],
//            [3, this._counterSpell],
            [5, this._manaBlast],
            [6, this._retribution]
        ];
        this._spellSelection();
        this.visible = false;
        this.spellSlotGroup.visible = false;
        this.currentSpell = undefined;
        this.roundTimer = 5;
//        this.player.animations.play('casting');
        
        
        this.events.castSpell = new Phaser.Signal();
  
    }


    _startCombatMode() {
        this.spellSlotGroup.visible = true;
        this.turnTimer.x = this._playerPositionX;
        this.turnTimer.y = this._playerPositionY + 40;
             this.turnTimerProgress.x = this._playerPositionX - 26;
        this.turnTimerProgress.y = this._playerPositionY + 38;
        this.turnTimer.visible = true;
        this.turnTimerProgress.visible = true;
        this._combatCycle();
    }
    
    _combatCycle(){
        this.turnTimerProgress.width = 0;
        this.turnTimerTween = this.game.add.tween(this.turnTimerProgress).to( { width: 54 }, 6000, 'Linear', true );
        if(this.currentSpell != undefined){
                    this.events.castSpell.dispatch();
     this.currentSpell();
        } else {
               
        }
        if(this.turnTimer.visible){
        this.turnTimerTween.onComplete.add(this._combatCycle, this);
            console.log('restartingcombatcycle');
        }
    }
    
//    _fireSpell(){
//         
//        
//    }
        _selectSpell(currentSpell) {
            this.currentSpell = currentSpell;
            this.spellArrow.x = this.game.camera.x + 28;
            this.spellArrow.y = this.spellSlot.y - 24;
            for(var i = 0; i < this.spellSelector; i++){
            this.spellArrow.x += 72;
             }
            this.spellArrow.visible = true;
    
    }
    
    
    
    
    
    _endCombatMode() {
        this.spellSlotGroup.visible = false;
        this.turnTimer.visible = false;
        this.spellArrow.visible = false;
        this.turnTimerProgress.visible = false;
        this.turnTimerTween.stop();
        this.currentSpell = undefined;
    }

    _spellSelection() {
        this.slotDistance = 10;
        for (var i = 0; i < this.spellArray.length; i++) {
            console.log('shazbot');
            this.spellSlot = this.game.add.image(this.slotDistance, 492, 'SpellSlot');
            this.spellSlotGroup.add(this.spellSlot);
            this.spellSlot.fixedToCamera = true;
            this.spellIcon = this.game.add.image(this.slotDistance + 6, 498, 'spellIcons');
            this.spellSlotGroup.add(this.spellIcon);
            this.spellIcon.fixedToCamera = true;
            this.slotDistance += 72;
            this.spellIcon.frame = this.spellArray[i][0];
            this.spellIcon.inputEnabled = true;
            let spellSelector = i;
            let spellAssigner = this.spellArray[i][1];
            this.spellIcon.events.onInputDown.add(function () {
              
                    this.spellSelector = spellSelector,
                  this._selectSpell(spellAssigner);
                  console.log(this.spellSelector);
            }, this);
        }
        this.turnTimer = this.game.add.image(20,200, 'turnTimer');
        this.turnTimer.anchor.setTo(0.5);
        this.turnTimer.visible = false;
        this.turnTimerProgress = this.game.add.tileSprite(0, 0, 54, 4, 'turnTimerProgress');
        this.turnTimerProgress.anchor.setTo(0.0);
        
        this.spellArrow = this.game.add.image (28,540, 'spellArrow');
        this.spellArrow.visible = false;
       // this.turnTimer.addchild(this.turnTimerProgress);
    }



    _initProjectileAttacks() {
        console.log('projectileattackInit');
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



    _manaBolt() {
        console.log('manaboltttttt');
                this.damage = 18;
                var stagger = 0.2;
        
            
                for (var i = 0; i < 3 /* + this.spellLevel*/ ; i++) {
                    this.game.time.events.add(Phaser.Timer.SECOND * stagger, function () {
                        this.AttackSpell = this.AttackSpells.getFirstDead();
                        this.AttackSpell.reset(this._playerPositionX + stagger + 30, this._playerPositionY + stagger);
                        this.AttackSpell.body.velocity.x = 900;
                        this.AttackSpell.frame = 0;
                        this.AttackSpell.damage = this.damage;
                    }, this);
                    stagger += 0.2;
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
                this.damage = 8;
        console.log('RainOvSpikes');
                var dog = 12;
                for (var i = 0; i < 4 + this.spellLevel; i++) {
                    this.AttackSpell = this.AttackSpells.getFirstDead();
                    this.AttackSpell.reset(this._playerPositionX + 122 + dog, 80 - dog);
                    this.AttackSpell.body.velocity.y = 400 + dog;
                    this.AttackSpell.frame = 1;
                     this.AttackSpell.damage = this.damage;
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