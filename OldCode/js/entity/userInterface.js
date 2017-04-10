class userInterface extends Phaser.Sprite {
    constructor(game) {
        super(game);
        game.add.existing(this);
        game.physics.arcade.enable(this);
        this._initHealthBar();
        this._initEnergyBar();
        this._player_energy = 20;
        this._player_health = 100;
        this._energy_regen = true;

    }
    _initHealthBar() {
        console.log('healthBar fired!');
        this._healthBar = this.game.add.image(4, 4, 'healthBar');
        this._healthBar.fixedToCamera = true;
        this._health_pixel = this.game.add.tileSprite(18, 12, 268, 12, 'healthPixel');
        this._health_pixel.fixedToCamera = true;
    }
    _initEnergyBar() {
        console.log('energyBar fired!');
        this._energyBar = this.game.add.image(4, 38, 'energyBar');
        this._energyBar.fixedToCamera = true;
          this._energy_pixel = this.game.add.tileSprite(12, 44, 184, 12, 'energyPixel');
        this._energy_pixel.fixedToCamera = true;
    }
    update() {
        this._energy_pixel.width  = this._player_energy / 100 * 184;
        this._health_pixel.width = this._player_health / 100 * 268;
    if(this._player_energy < 100 && this._energy_regen) {
        this._player_energy += 0.15;
    }
}}