class userInterface extends Phaser.Sprite {
    constructor(game) {
        super(game);
        game.add.existing(this);
        game.physics.arcade.enable(this);
        this._initOverlay();
        this._player_health = 100;
        this.actionSelected = 0;
        this._playerBlocking = false;
        this._Gold = 50;
    }

    // Initialise menu items here
    _initOverlay() {
        this.healthBar = this.game.add.sprite(2, 2, 'healthBar');
        this.healthBar.fixedToCamera = true;

        this.energyBar = this.game.add.sprite(2, 22, 'energyBar');
        this.energyBar.fixedToCamera = true;

        this.healthBarLevel = this.game.add.tileSprite(24, 5, 218, 10, 'HPixel');
        this.healthBarLevel.fixedToCamera = true;

        this.energyBarLevel = this.game.add.tileSprite(24, 25, 218, 10, 'HPixel');
        this.energyBarLevel.fixedToCamera = true;

        this.goldCounter = this.game.add.sprite(2, 42, 'goldCounter');
        this.goldCounter.fixedToCamera = true;

        this.style = {
            font: "12px Press Start 2P",
            fill: "#9bb670",
            align: "center"
        };
        this.goldAmount = this.game.add.text(33, 44, '14', this.style);
        this.goldAmount.fixedToCamera = true;

    }
    _playerDamage(_damage) {
        this._player_health -= _damage;
        this.healthBarLevel.width = this._player_health / 100 * 210;
    }

    _addGold(amount) {

    }




    // When combat event is is fired
    // We should have a round timer, keeping track of the rounds. so.. RoundCounter++; i guess.
    //Spawn roundtimer on screen.
    // player selects from the actions pool. Enemy randomly does the same. Round timer runs out and both play out their chosen attack.
    //Attacks can be blocked, spells disrupted.. perhaps.

    //So in programming terms we'd add 2 functions to the enemy.js, attack and block.
    //Two functions to the player.js, attack and block.
    //And in the userinterface we create this function. On start -> show roundtimer, randomly select a method for the enemy.
    //Player selects their chosen method of attack. two animations play and round resets. Gonna be interesting to code really.

    update() {

    }
}





//                    this._exampleTween = this.game.add.tween(this._reloadProgress).to({
//                    width: 0
//                }, 1500, 'Linear', true);
//                 this._reloading = true;
//                this.game.time.events.add(Phaser.Timer.SECOND * 1.6, this._reloadComplete, this);



//
//
//
//class userInterface extends Phaser.Sprite {
//    constructor(game) {
//        super(game);
//        game.add.existing(this);
//        game.physics.arcade.enable(this);
//        this._initHealthBar();
//        this._initEnergyBar();
//        this._player_energy = 20;
//        this._player_health = 100;
//        this._energy_regen = true;
//
//    }
//    _initHealthBar() {
//        console.log('healthBar fired!');
//        this._healthBar = this.game.add.image(4, 4, 'healthBar');
//        this._healthBar.fixedToCamera = true;
//        this._health_pixel = this.game.add.tileSprite(18, 12, 268, 12, 'healthPixel');
//        this._health_pixel.fixedToCamera = true;
//    }
//    _initEnergyBar() {
//        console.log('energyBar fired!');
//        this._energyBar = this.game.add.image(4, 38, 'energyBar');
//        this._energyBar.fixedToCamera = true;
//          this._energy_pixel = this.game.add.tileSprite(12, 44, 184, 12, 'energyPixel');
//        this._energy_pixel.fixedToCamera = true;
//    }
//    update() {
//        this._energy_pixel.width  = this._player_energy / 100 * 184;
//        this._health_pixel.width = this._player_health / 100 * 268;
//    if(this._player_energy < 100 && this._energy_regen) {
//        this._player_energy += 0.15;
//    }
//}}