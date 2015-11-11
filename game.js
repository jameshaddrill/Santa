
BasicGame.Game = function (game) {

};

BasicGame.Game.prototype = {
  preload: function () {
    this.load.image('sea', 'assets/sea.png');
    this.load.image('bullet', 'assets/bullet.png');
    this.load.spritesheet('greenEnemy', 'assets/enemy.png', 32, 32);
    this.load.spritesheet('explosion', 'assets/explosion.png', 32, 32);
    this.load.spritesheet('player', 'assets/player.png', 64, 64);
  },

  create: function () {
    this.sea = this.add.tileSprite(0, 0, 800, 600, 'sea');

    // player
    this.player = this.add.sprite(400, 550, 'player');
    this.player.anchor.setTo(0.5, 0.5);
    this.player.animations.add('fly', [ 0, 1, 2 ], 20, true);
    this.player.play('fly');
    this.physics.enable(this.player, Phaser.Physics.ARCADE);
    this.player.speed = 300;
    this.player.body.collideWorldBounds = true;
    // 20 x 20 pixel hitbox, centered a little bit higher than the center
    this.player.body.setSize(20, 20, 0, -5);


    // enemy pool
      //Add an empty sprite group
      this.enemyPool = this.add.group();

      //Enable physics to the whole sprite group
      this.enemyPool.enableBody = true;
      this.enemyPool.physicsBodyType = Phaser.Physics.ARCADE;

      // add 50 enemies to the pool
      this.enemyPool.createMultiple(50, 'greenEnemy');

      //sets anchors of all sprites
      this.enemyPool.setAll('anchor.x', 0.5);
      this.enemyPool.setAll('anchor.y', 0.5);     

      //kill if out of bounds 
      this.enemyPool.setAll('outOfBoundsKill', true);
      this.enemyPool.setAll('checkWorldBounds', true);

      //set animation for each sprite
      this.enemyPool.forEach(function (enemy) {
        enemy.animations.add('fly', [ 0, 1, 2 ], 20, true);
      });

      this.nextEnemyAt = 0;
      this.enemyDelay = 1000;

    // bullet pool
      //Add an empty  sprite group into the game
      this.bulletPool = this.add.group();

      //Enable physics to the whole sprite group
      this.bulletPool.enableBody = true;
      this.bulletPool.physicsBodyType = Phaser.Physics.ARCADE;

      //Add 109 'bullet' sprites into the group
      //by default this uses the first frame of the sprite sheet and
      //sets the initial state as non-existing (ie killed/dead)
      this.bulletPool.createMultiple(100, 'bullet');

      //sets anchors of all sprites
      this.bulletPool.setAll('anchor.x', 0.5);
      this.bulletPool.setAll('anchor.y', 0.5);

      //kills sprites that go out of bounds
      this.bulletPool.setAll('outOfBoundsKill', true);
      this.bulletPool.setAll('checkWorldBounds', true);

      this.nextShotAt = 0;
      this.shotDelay = 100;

    // initialize cursor controls
    this.cursors = this.input.keyboard.createCursorKeys();

    // instructions appear for first 10 seconds of play
    this.instructions = this.add.text( 400, 500, 
      'Use Arrow Keys to Move, Press Z to Fire\n' + 
      'Tapping/clicking does both', 
        {font: '20px monospace', fill: '#fff', align: 'center' }
    );
    this.instructions.anchor.setTo (0.5, 0.5);
    this.instExpire = this.time.now + 10000;
  },

  update: function () {
    this.sea.tilePosition.y += 0.2;

    // detect bullets hitting enemy
    this.physics.arcade.overlap(
      this.bulletPool, this.enemyPool, this.enemyHit, null, this
    );

    // detect enemy hitting player
    this.physics.arcade.overlap(
      this.enemyPool, this.player, this.playerHit, null, this
    )

    // enemy spawning
          if (this.nextEnemyAt < this.time.now && this.enemyPool.countDead() > 0) {
      this.nextEnemyAt = this.time.now + this.enemyDelay;
      var enemy = this.enemyPool.getFirstExists(false);
      // spawn at a random location top of the screen
      enemy.reset(this.rnd.integerInRange(20, 780), 0);
      // also randomize the speed
      enemy.body.velocity.y = this.rnd.integerInRange(30, 60);
      enemy.play('fly');
    }


    // player keyboard controls
    this.player.body.velocity.x = 0;
    this.player.body.velocity.y = 0;

    if (this.cursors.left.isDown) {
      this.player.body.velocity.x = -this.player.speed;
    } else if (this.cursors.right.isDown) {
      this.player.body.velocity.x = this.player.speed;
    }

    if (this.cursors.up.isDown) {
      this.player.body.velocity.y = -this.player.speed;
    } else if (this.cursors.down.isDown) {
      this.player.body.velocity.y = this.player.speed;
    }

    // mouse pointer controls
    if (this.input.activePointer.isDown && this.physics.arcade.distanceToPointer(this.player) > 15) {
      this.physics.arcade.moveToPointer(this.player, this.player.speed);
    }

    // shoot bullets
    if (this.input.keyboard.isDown(Phaser.Keyboard.Z) || this.input.activePointer.isDown) {
      this.fire();
    }

    if (this.instructions.exists && this.time.now > this.instExpire) {
      this.instructions.destroy();
    } 


  },

  render: function() {
    //this.game.debug.body(this.bullet);
    //this.game.debug.body(this.enemy);
    this.game.debug.body(this.player);
  },

  fire: function() {
    if (!this.player.alive || this.nextShotAt > this.time.now) {
      return;
    }

    if (this.bulletPool.countDead() === 0) {
      return;
    }

    this.nextShotAt = this.time.now + this.shotDelay;
    
    // find the first dead bullet in the pool
    var bullet = this.bulletPool.getFirstExists(false);

    // reset (revive) the sprite and place it in a new locations
    bullet.reset(this.player.x, this.player.y, - 20);

    bullet.body.velocity.y = -500;
  },

  enemyHit: function(bullet, enemy) {
    bullet.kill();
    enemy.kill();
    var explosion = this.add.sprite(enemy.x, enemy.y, 'explosion');
    explosion.anchor.setTo(0.5, 0.5);
    explosion.animations.add('boom');
    explosion.play('boom', 15, false, true);
  },

  playerHit: function(player, enemy) {
    enemy.kill();
    var explosion = this.add.sprite(player.x, player.y, 'explosion');
    explosion.anchor.setTo(0.5, 0.5);
    explosion.animations.add('boom');
    explosion.play('boom', 15, false, true);
    player.kill();
  },

  quitGame: function (pointer) {

    //  Here you should destroy anything you no longer need.
    //  Stop music, delete sprites, purge caches, free resources, all that good stuff.

    //  Then let's go back to the main menu.
    this.state.start('MainMenu');

  }

};
