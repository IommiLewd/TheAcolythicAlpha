var game = game || {};

game.Enemy = function(game, x, y, key, velocity, tilemap) {
  Phaser.Sprite.call(this, game, x, y, key);
  
  this.game = game;
  this.tilemap = tilemap;
  this.anchor.setTo(0.5);
  
  if(velocity === undefined) {
    velocity = (40 + Math.random() * 20) * (Math.random() < 0.5 ? 1 : -1);
  }

  this.game.physics.arcade.enableBody(this);
  this.body.collideWorldBounds = true;
  this.body.bounce.set(1, 0);
  this.body.velocity.x = velocity;
};

game.Enemy.prototype = Object.create(Phaser.Sprite.prototype);
game.Enemy.prototype.constructor = game.Enemy;



game.Enemy.prototype.update = function(){
  var direction
  if(this.body.velocity.x > 0){
    this.scale.setTo(-1,1);
    direction = 1;
  }
  else {
    this.scale.setTo(1, 1);
    direction = -1;
  }
  var nextX = this.x + direction * (Math.abs(this.width)/2 + 1);
  var nextY = this.bottom + 1;
  var yModifier = this.y - 64;

 var nextTile = this.tilemap.getTileWorldXY(nextX, nextY, 64, 64, 'CollisionLayer');
  if(!nextTile && this.body.blocked.down && this.y > playerYPosition) {
    this.body.velocity.x *= -1;
  }
};


