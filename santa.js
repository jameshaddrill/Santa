;(function() {

	// main game object

	var Game = function() {

	    // get the cavas element from the DOM
	    var canvas = document.getElementById("santa");

		// Get the drawing context.  This contains functions that let you draw to the canvas.
    	var screen = canvas.getContext('2d');

    	// Note down the dimensions of the canvas.  These are used to
	    // place game bodies.
	    var gameSize = { x: canvas.width, y: canvas.height };

	    // Create the player array to hold the player
    	this.player = [];

    	// Create the bodies array to hold the chimneys.
    	this.chimneys = [];

    	// Create the bombs array to hold the bombs
    	this.bombs = [];

    	// Add the player to the players array.
    	this.player = this.player.concat(new Player(this, gameSize));

    	// Add other bodies to bodies array
    	this.chimneys = this.chimneys.concat(createBuildings(this, gameSize));

    	var self = this;

	    // Main game tick function.  Loops forever, running 60ish times a second.
	    var tick = function() {

	      // Update game state.
	      self.update();

	      // Draw game bodies.
	      self.draw(screen, gameSize);

	      // Queue up the next call to tick with the browser.
	      requestAnimationFrame(tick);
	    };

	    // Run the first game tick.  All future calls will be scheduled by
	    // the tick() function itself.
	    tick();

    }

	Game.prototype = {
		// **update()** runs the main game logic.
	    update: function() {
	      	var self = this;
	      	//console.log('test');

	    	// Call update on player.
	     	for (var i = 0; i < this.player.length; i++) {
		        this.player[i].update();
		    }

		    // Call update on bombs.
	     	for (var i = 0; i < this.bombs.length; i++) {
		        this.bombs[i].update();
		    }

		},

		// **draw()** draws the game.
	    draw: function(screen, gameSize) {
	      // Clear away the drawing from the previous tick.
	      screen.clearRect(0, 0, gameSize.x, gameSize.y);

	      // Draw each body as a rectangle.
	      for (var i = 0; i < this.player.length; i++) {
	        //drawPlayer(screen, this.player[i]);
	        drawRect(screen, this.player[i]);
	      }

	      for (var i = 0; i < this.chimneys.length; i++) {
	      	drawRect(screen, this.chimneys[i]);
	      }

	      for (var i = 0; i < this.bombs.length; i++) {
	      	drawRect(screen, this.bombs[i]);
	      }
	    },

	    // **addBody()** adds a body to the bodies array.
	    addBody: function(body) {
	      this.bombs.push(body);
	    }
	}

	// Player
	// ------

	// **new Player()** creates a player.

	var Player = function(game, gameSize) {
	    this.game = game;
	    this.size = { x: 15, y: 15 };
	    this.center = { x: 10, y: 10};

	    // Create a keyboard object to track button presses.
	    this.keyboarder = new Keyboarder();


	    this.patrolX = 0;

	    this.speedX = 2;
	};

	Player.prototype = {

	    // **update()** updates the state of the player for a single tick.
	    update: function() {
	      // If left cursor key is down...
	      /*if (this.keyboarder.isDown(this.keyboarder.KEYS.LEFT)) {

	        // ... move left.
	        this.center.x -= 2;

	      } else if (this.keyboarder.isDown(this.keyboarder.KEYS.RIGHT)) {
	        this.center.x += 2;
	      } */

	      // If the invader is outside the bounds of their patrol...
	      if (this.patrolX < 0 || this.patrolX > 250) {

	        // ... reverse direction of movement.
	        this.speedX = -this.speedX;

	        this.center.y +=10;
	      }

	      // Move according to current x speed.
	      this.center.x += this.speedX;


	      // Update variable that keeps track of current position in patrol.
	      this.patrolX += this.speedX;

	      if (this.keyboarder.isDown(this.keyboarder.KEYS.S)) {
	      	 var bomb = new Bomb({ x: this.center.x, y: this.center.y - this.size.y + 10 },
                                { x: 0, y: 7 });

	      	// ... add the bullet to the game...
        	this.game.addBody(bomb);
	      }

  		}

  	};

  	// Bomb
	// ------

	// **new Bomb()** creates a new bomb.
	var Bomb = function(center, velocity) {
	    this.center = center;
	    this.size = { x: 10, y: 10 };
	    this.velocity = velocity;
	};

    Bomb.prototype = {
	    // **update()** updates the state of the bullet for a single tick.
	    update: function() {
	      // Add velocity to center to move bullet.
	      this.center.x += this.velocity.x;
	      this.center.y += this.velocity.y;
	    }
  	};

  	// Buildings
  	// -------------
  	// **new Building()** creates a chimney

  	var Building = function(game, center, height) {
  		this.game = game;
	    this.center = center;
	    this.size = { x: 50, y: height };
  	}


  	// **createInvaders()** returns an array of twenty-four invaders.
	 var createBuildings = function(game, gameSize) {

	    var buildings = [];
	    for (var i = 0; i < 18; i++) {
	    	var buildingHeight = Math.random() * (500 - 100 + 1) + 100;

		    // Place invaders in 10 columns.
		    var x = 25 + (i % 18) * 50;
		    var y = gameSize.y - buildingHeight / 2;

		    // Create invader.
		    buildings.push(new Building(game, { x: x, y: y}, buildingHeight));
	    }

	    return buildings;

	};



	// Keyboard input tracking
	// -----------------------

	// **new Keyboarder()** creates a new keyboard input tracking object.
	var Keyboarder = function() {
		// Records up/down state of each key that has ever been pressed.
	    var keyState = {};

	    // When key goes down, record that it is down.
	    window.addEventListener('keydown', function(e) {
	      keyState[e.keyCode] = true;
	    });

	    // When key goes up, record that it is up.
	    window.addEventListener('keyup', function(e) {
	      keyState[e.keyCode] = false;
	    });

	    // Returns true if passed key is currently down.  `keyCode` is a
	    // unique number that represents a particular key on the keyboard.
	    this.isDown = function(keyCode) {
	      return keyState[keyCode] === true;
	    };

	    // Handy constants that give keyCodes human-readable names.
	    this.KEYS = { LEFT: 37, RIGHT: 39, S: 83 };
	};


	// Other functions
    // ---------------

	// **drawRect()** draws passed body as a rectangle to `screen`, the drawing context.
	var drawRect = function(screen, body) {
	    screen.fillRect(body.center.x - body.size.x / 2, body.center.y - body.size.y / 2,
	                    body.size.x, body.size.y);
	};


	/*var drawPlayer = function(screen, body) {
		var playerImg = new Image();
		playerImg.src = 'assets/santa.png'

		var santa = sprite({
		    context: screen,
		    width: 100,
		    height: 100,
		    image: playerImg
		});

	    screen.drawImage(playerImg, 0, 0, 128, 64, 0, 0, 128, 64);
	}

	var sprite = function(options) {
		var that = {};

	    that.context = options.context;
	    that.width = options.width;
	    that.height = options.height;
	    that.image = options.image;

	    return that;
	} */

	// When the DOM is ready, create (and start) the game.
	window.addEventListener('load', function() {
	  new Game();
	});



})();