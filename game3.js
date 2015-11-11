
BasicGame.Game = function (game) {

};

BasicGame.Game.prototype = {
  	preload: function () {
  		this.load.image('bg', 'assets/bg.png');
  		this.load.image('chimney', 'assets/chimney.png');
  		this.load.image('mincepie', 'assets/mince.png')
  		this.load.spritesheet('player', 'assets/santa.png', 64, 67);
  		this.load.spritesheet('playerSm', 'assets/santatwo.png', 75, 78);
  		this.load.spritesheet('playerMd', 'assets/santathree.png', 80, 83);
  		this.load.spritesheet('playerLg', 'assets/santafour.png', 90, 93);
	},

  	create: function () {
      this.physics.startSystem(Phaser.Physics.ARCADE);
  		this.bg = this.add.tileSprite(0, 0, 800, 600, 'bg');

      this.loopCounter = 0;
      this.chimneyVel = 30;

  		// chimney left
    	  //Add an empty sprite group
	      this.chimneyPool = this.add.group();
        
        this.chimneyPool.create(this.xPos, 890, 'chimney');
        this.chimneyPool
	      //Enable physics to the whole sprite group
	      this.chimneyPool.enableBody = true;
	      this.chimneyPool.physicsBodyType = Phaser.Physics.ARCADE;

	      // add 200 sprites to the pool
	      //this.chimneyPool.createMultiple(200, 'chimney');
	      this.nextSliceAt = 0;
    	  this.sliceDelay = 350;

        this.addWall = this.chimneyPool.create(this.xPos, 890, 'chimney');

        this.addWall.enableBody = true;
        this.addWall.physicsBodyType = Phaser.Physics.ARCADE;


         // set chimney velocity
         
        this.addWall.body.velocity.y = -chimneyVel;
        //

         //this.chimneyPool.body.immovable = true;


	    

		this.xPos = -500;




	},

	update: function () {
    var chimLength = this.chimneyPool.length;
		var latest = this.chimneyPool.getAt(chimLength-1)
    console.log(chimLength);
    //console.log(latest.body.position.y);
      if (latest.body.position.y < 880) {
        chimney = this.chimneyPool.create(this.xPos, latest.body.y - 90, 'chimney');

        chimney.body.velocity.y = -this.chimneyVel;

      }
    	
	},

  	render: function() {
  		//this.game.debug.body(this.player);
  		//this.game.debug.body(chimney);
  		//this.game.debug.body(chimneyR);

  	},

    // sprite out of bounds
    chimneyOOB: function(chim) {
      chim.kill();
    },
  

  	
  	

  	chimneyDirection: function() {
  		//console.log(this.xGap);

  		if (this.loopCounter == 1) {
  			this.xGap = 1150;
  		}

  			
		  else if (this.loopCounter == 10) {
  			this.chimneyVel = this.chimneyVel + 100;
  			this.wiggleSize = this.wiggleSize + 20;
  			
  		}
  		else if (this.loopCounter == 15) {
  			this.chimneyVel = this.chimneyVel + 100;
  			this.wiggleSize = this.wiggleSize + 20;
  		}

		else if (this.loopCounter == 20) {
  			
  		}


  		var direction = this.game.rnd.integerInRange(0, 5);

  		var RHwidth = this.xPos + this.xGap + 100;


  		if (this.xPos + this.xGap + 100 > this.game.world.width) {

  			if (direction < 4) {
  				this.xPos = this.xPos - this.wiggleSize;
  			}
  		}

  		else if (this.xPos + 50 < 0) {
  			if (direction < 4) {
  				this.xPos = this.xPos + this.wiggleSize;
  			}
  		}

  		else {

	  		if (direction < 3) {
	  			this.xPos = this.xPos + this.wiggleSize;
	  		}
	  		else if (direction < 5) {
	  			this.xPos = this.xPos - this.wiggleSize;
	  		}

	  	}

  		this.loopCounter = this.loopCounter + 1;
  	}

 };