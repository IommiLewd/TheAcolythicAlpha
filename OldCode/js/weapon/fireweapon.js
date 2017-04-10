/**
 * base class for fire weapons.
 *
 * @class FireWeapon
 * @constructor
 *    @param damage         : the damage weapon multiplier.
 *    @param fire_rate      : the rate of fire of the weapon.
 *    @param range          : how far bullet goes
 *    @param magazine_size  : how much bullets the weapon can hold.
 *    @param recoil         : how much recoil after fire once.
 *    @param accuracy       : how accurate are the shot.
 *    @param ammo           : the amount of ammo currently in the magazine
 *    @param reload_time    : the time to reload the weapon
 *    @param ammo_type   : the time to reload the weapon
 *
 * @method reload
 *    reload the weapon. ensure the amount of ammo does not exceed
 *    magazine size.
 *    @param ammo_amount, amount of ammo to reload with
 *    @return amount of ammo unused to reload.
 * @method shoot
 *
 * @property damage         : the damage weapon multiplier.
 * @property fire_rate      : the rate of fire of the weapon.
 * @property range          : how far bullet goes
 * @property magazine_size  : how much bullets the weapon can hold.
 * @property recoil         : how much recoil after fire once.
 * @property accuracy       : how accurate are the shot.
 * @property ammo           : the amount of ammo currently in the magazine
 *    No setter. use reload.
 * @property reload_time    : the reload_time of the weapon multiplier
 *
 */
 class FireWeapon {
  constructor(damage,fire_rate,
    range,magazine_size,recoil,
    accuracy,reload_time,ammo,ammo_type){

    if (ammo > magazine_size){
      this._ammo = magazine_size;  //ammo inthe magazine.
      //TODO: add throw error
    } else {
      this._ammo = ammo;
    }
    this._damage = damage;
    this._fire_rate = fire_rate;
    this._range = range;
    this._magazine_size = magazine_size;
    this._recoil = recoil;
    this._accuracy = accuracy;
    this._reload_time = reload_time;
    this._ammo_type = ammo_type;

    this._locked = false;

  }
//@public methods:
  reload(ammo_amount){
    let empties = this._magazine_size - ammo;
    if (empties >= ammo_amount){
      this._ammo = this._ammo + ammo_amount;
      return 0;
    }
    else {
      this._ammo = this._magazine_size;
      return ammo_amount - empties;
    }
  }
  shoot(){
    if (!this._locked){
      this._ammo -= 1;
      return true;
    } else {
      return false;
    }
  }
  //@properties :
  get damage(){
    return this._damage;
  }
  get fireRate(){
    return this._fire_rate;
  }
  get range(){
    return this._range;
  }
  get magazineSize(){
    return this._magazine_size;
  }
  get reload_time(){
    return this.reload_time;
  }
  get recoil(){
    return this._recoil;
  }
  get accuracy(){
    return this._accuracy;
  }
  get ammo(){
    return this._ammo;
  }
  get ammoType(){
    return this._ammo_type;
  }

}
