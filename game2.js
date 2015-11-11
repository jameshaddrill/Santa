BasicGame.Game = function(game) {

};

BasicGame.Game.prototype = {
    preload: function() {
        this.load.image('bg', 'assets/bg.png');
        this.load.image('bg2', 'assets/bgTwo.png');
        this.load.image('chimney', 'assets/chimney.png');
        this.load.image('mincepie', 'assets/mince_pie.png', 30, 21);
        this.load.image('roof', 'assets/roof.png', 800, 320);
        this.load.image('sky', 'assets/sky.png', 800, 320);
        this.load.spritesheet('player', 'assets/santa.png', 64, 67);
        this.load.spritesheet('playerSm', 'assets/santatwo.png', 75, 78);
        this.load.spritesheet('playerMd', 'assets/santathree.png', 80, 83);
        this.load.spritesheet('playerLg', 'assets/santafour.png', 90, 93);
    },

    init: function(score) {
        this.game.time.reset();
    },

    create: function() {
        // bg color (sky to begin with)
        this.stage.backgroundColor = '#11699c';

        // loop counter
        this.loopCounter = 0;

        // speed of chimney
        this.chimneyVel = 300;

        // amount that chimney wiggles
        this.wiggleSize = 40;

        // how long between wiggles
        this.wiggleTime = 1000;

        // x position of left wall
        this.xPos = -610;
        // gap between chimney walls
        this.xGap = 1150;

        // starting score
        this.score = 0;
        // variable for storing score text
        this.scoreText;

        // starting multiplier
        this.multiplier = 1;
        // variable for storing score text
        this.multiplierText;

        // chimney left
        //Add an empty sprite group
        this.chimneyPool = this.add.group();

        //Enable physics to the whole sprite group
        this.chimneyPool.enableBody = true;
        this.chimneyPool.physicsBodyType = Phaser.Physics.ARCADE;

        this.nextSliceAt = 0;
        this.sliceDelay = 290;

        chimney = this.chimneyPool.create(this.xPos, 800, 'chimney');

        // set chimney velocity
        chimney.body.velocity.y = -this.chimneyVel;

        chimney.body.immovable = true;


        // chimney right
        //Add an empty sprite group
        this.chimneyPoolRight = this.add.group();

        //Enable physics to the whole sprite group
        this.chimneyPoolRight.enableBody = true;
        this.chimneyPoolRight.physicsBodyType = Phaser.Physics.ARCADE;

        // add 200 sprites to the pool
        //this.chimneyPoolRight.createMultiple(200, 'chimney');

        this.nextRSliceAt = 0;
        this.sliceRDelay = 290;

        chimneyR = this.chimneyPool.create(this.xPos + this.xGap, 800, 'chimney');

        // set chimney velocity
        chimneyR.body.velocity.y = -this.chimneyVel;
        chimneyR.body.immovable = true;

        // pies
        this.nextPresAt = 0;
        this.presDelay = 10200;

        // pies
        this.nextPieAt = 0;
        this.pieDelay = 4000;

        //sky
        this.sky = this.add.sprite(0, 100, 'sky');
        this.physics.enable(this.sky, Phaser.Physics.ARCADE);

        this.sky.body.velocity.y = -300;

        // player
        this.player = this.add.sprite(400, 25, 'player');
        this.player.animations.add('left', [0, ], 0, true);
        this.player.animations.add('right', [1], 0, true);
        this.player.play('fly');
        this.physics.enable(this.player, Phaser.Physics.ARCADE);
        this.player.speed = 300;
        this.player.body.collideWorldBounds = true;
        this.playerSize = "small";

        // 20 x 20 pixel hitbox, centered a little bit higher than the center
        this.player.body.setSize(64, 64, 0, 0);

        this.roof = this.add.sprite(0, 500, 'roof');
        this.physics.enable(this.roof, Phaser.Physics.ARCADE);

        this.roof.body.velocity.y = -300;

        this.gameTimer = 0;

        // initialize cursor controls
        this.cursors = this.input.keyboard.createCursorKeys();

        //  Create our Timer
        gameTimer = this.game.time.create(false);

        //  Set a TimerEvent to occur after 2 seconds
        gameTimer.loop(this.wiggleTime, this.chimneyDirection, this);

        //  Start the timer running - this is important!
        //  It won't start automatically, allowing you to hook it to button events and the like.
        gameTimer.start();

        // score
        this.scoreText = this.game.add.text(16, 16, 'Score: 0', {
            font: '32px monospace',
            fill: '#fff'
        });

        // multiplier
        this.multiplierText = this.game.add.text(500, 16, 'Multiplier: 1', {
            font: '32px monospace',
            fill: '#fff'
        });

        this.game.time.events.loop(Phaser.Timer.SECOND * 1, this.updateScore, this);
    },

    update: function() {


        if (this.roof.position.y < this.game.world.height - 200) {
            this.stage.backgroundColor = '#8a8a8a';
        }

        this.roofGone();

        this.chimneyOOB();
        //console.log('xpos: ' + this.xPos);
        //console.log('xposR: ' + this.xPosR);

        //collisions against chinmney walls
        this.game.physics.arcade.collide(this.player, this.chimneyPool, this.gameOver, null, this);
        this.game.physics.arcade.collide(this.player, this.chimneyPoolRight, this.gameOver, null, this);

        //collisions between player and pies
        this.game.physics.arcade.collide(this.player, this.mincepie, this.pieCollision, null, this);

        //collisions between player and presents
        this.game.physics.arcade.collide(this.player, this.pressie, this.presCollision, null, this);



        var chimLength = this.chimneyPool.length;
        var latest = this.chimneyPool.getAt(chimLength - 1)

        if (latest.body.position.y < 650) {
            //console.log("chimneyAdd");
            chimney = this.chimneyPool.create(this.xPos, latest.body.y + 90, 'chimney');
            chimney.body.velocity.y = -this.chimneyVel;
            this.chimneyPool.setAll('body.immovable', true);
            chimneyR = this.chimneyPoolRight.create(this.xPos + this.xGap, latest.body.y + 90, 'chimney');
            chimneyR.body.velocity.y = -this.chimneyVel;
            this.chimneyPoolRight.setAll('body.immovable', true);
        }

        // this creates the presents
        if (this.nextPresAt < this.time.now && this.loopCounter > 4) {
            this.nextPresAt = this.time.now + this.presDelay;
            this.addPres();
        }


        // this creates the mince pies

        if (this.nextPieAt < this.time.now && this.loopCounter > 2) {
            this.nextPieAt = this.time.now + this.pieDelay;
            this.addPie();
        }


        // player keyboard controls
        //this.player.body.velocity.x = 0;

        if (this.player.body.position.y < 100) {
            this.player.body.velocity.y = 50;
        } else {
            this.player.body.velocity.y = 0;
        }
        if (this.loopCounter > 1) {
            if (this.cursors.left.isDown) {
                this.player.body.velocity.x = this.player.body.velocity.x - 5; //-this.player.speed;
                this.player.animations.play('right');
            } else if (this.cursors.right.isDown) {
                this.player.body.velocity.x = this.player.body.velocity.x + 5; // this.player.speed;
                this.player.animations.play('left');
            }
        }

        /* if (this.cursors.up.isDown) {
        this.player.body.velocity.y = -this.player.speed;
      } else if (this.cursors.down.isDown) {
        this.player.body.velocity.y = this.player.speed;
      } */

        // mouse pointer controls
        /*if (this.input.activePointer.isDown && this.physics.arcade.distanceToPointer(this.player) > 15) {
        this.physics.arcade.moveToPointer(this.player, this.player.speed);
      }*/




    },

    updateScore: function() {
        console.log('score');
        this.score = Math.floor(this.score + (1 * this.multiplier));
        this.scoreText.text = 'Score: ' + this.score;
    },

    chimneyOOB: function() {
        this.chimneyPool.forEach(function(item) {
            if (item.y < -100) {
                item.kill();
            }

        });

    },

    render: function() {
        //this.game.debug.body(this.player);
        //this.game.debug.body(chimney);
        //this.game.debug.body(chimneyR);

    },

    gameOver: function() {
        //console.log('dead');
        this.player.kill();
        this.endGame();
    },

    roofGone: function() {
        if (this.roof.position.y + 600 < 0) {
            this.roof.kill;
        }
    },
    pieCollision: function() {
        this.mincepie.kill();
        if (this.playerSize == "small") {
            this.player.body.setSize(75, 75);
            this.player.loadTexture('playerSm')
            this.playerSize = "medium";
        } else if (this.playerSize == "medium") {
            this.player.body.setSize(80, 80);
            this.player.loadTexture('playerMd');
            this.playerSize = "large";
        } else if (this.playerSize == "large") {
            this.player.body.setSize(90, 90);
            this.player.loadTexture('playerLg');
            this.playerSize = "huge";
        } else if (this.playerSize == "huge") {
            this.player.scale.x = this.player.scale.x * 1.1;
            this.player.scale.y = this.player.scale.y * 1.1;
        }
        this.multiplier = 1;
        this.multiplierText.text = 'Multiplier: ' + this.multiplier;
    },
    presCollision: function() {
        this.pressie.kill();
        //  Add and update the score
        this.multiplier += 1;
        this.multiplierText.text = 'Multiplier: ' + this.multiplier;
    },
    chimneyPostion: function() {
        chimney.reset(this.xPos, 600);
    },
    chimneyPostionRight: function() {
        chimneyR.reset(this.xPos + this.xGap, 600);
    },

    chimneyDirection: function() {

        if (this.loopCounter == 5) {
            this.xGap = 1200;
        } else if (this.loopCounter == 10) {

            this.chimneyVel = this.chimneyVel + 100;
            this.chimneyPool.setAll('body.velocity.y', -this.chimneyVel);
            this.chimneyPoolRight.setAll('body.velocity.y', -this.chimneyVel);

            this.xGap = 1150;

            this.mincepie.body.velocity.y = -this.chimneyVel;
            this.pressie.body.velocity.y = -this.chimneyVel;
            this.wiggleSize = this.wiggleSize + 20;
            this.wiggleTime = this.wiggleTime - 100;

        } else if (this.loopCounter == 15) {
            //console.log('15');
            // DS - Update chimney velocities
            this.chimneyVel = this.chimneyVel + 100;
            this.chimneyPool.setAll('body.velocity.y', -this.chimneyVel);
            this.chimneyPoolRight.setAll('body.velocity.y', -this.chimneyVel);

            this.mincepie.body.velocity.y = -this.chimneyVel;
            this.pressie.body.velocity.y = -this.chimneyVel;
            this.wiggleSize = this.wiggleSize + 20;
            this.wiggleTime = this.wiggleTime - 100;
        } else if (this.loopCounter == 20) {
            //console.log('20');
            this.wiggleTime = this.wiggleTime - 100;
        }





        var direction = this.game.rnd.integerInRange(0, 9);

        var RHwidth = this.xPos + this.xGap + 100;

        if (this.loopCounter > 2) {

            if (this.xPos > -440) {

                if (direction < 8) {
                    this.xPos = this.xPos - this.wiggleSize;
                }

            } else if (this.xPos < -800) {
                if (direction < 8) {
                    this.xPos = this.xPos + this.wiggleSize;
                }
            } else {

                if (direction < 4) {
                    this.xPos = this.xPos + this.wiggleSize;
                } else if (direction < 8) {
                    this.xPos = this.xPos - this.wiggleSize;
                }



            }

        }


        this.loopCounter = this.loopCounter + 1;
    },

    addPres: function() {

        var presLeft = this.xPos + 930;
        var presRight = (this.xGap + this.xPos) - 40;

        var presPos = this.game.rnd.integerInRange(presLeft, presRight);

        //console.log(presPos);
        this.pressie = this.add.sprite(presPos, this.game.world.height + 50, 'present');


        this.game.physics.arcade.enable(this.pressie);

        this.pressie.enableBody = true;

        // set pie velocity
        this.pressie.body.velocity.y = -this.chimneyVel;

        presOverlap = this.game.physics.arcade.overlap(this.pressie, this.mincepie);

        if (presOverlap) {
            this.pressie.position.x = this.pressie.position.x + 30;
        }

    },

    addPie: function() {
        //console.log('addPie');

        var pieSide = this.game.rnd.integerInRange(1, 2);
        //console.log(pieSide);
        if (pieSide = 1) {
            this.mincepie = this.add.sprite(this.game.rnd.integerInRange(this.xPos + 1000, this.xPos + 1020), this.game.world.height + 50, 'mincepie');
        } else {
            this.mincepie = this.add.sprite(this.game.rnd.integerInRange((this.xPos + this.xGap) - 100, this.xPos + this.xGap - 60), this.game.world.height + 50, 'mincepie');
        }

        this.game.physics.arcade.enable(this.mincepie);

        this.mincepie.enableBody = true;

        // set pie velocity
        this.mincepie.body.velocity.y = -this.chimneyVel;


    },

    createChimney: function() {
        chimney = this.chimneyPool.create(0, 0, 'chimney');

        this.chimneyPostion();


        // set chimney velocity
        chimney.body.velocity.y = -this.chimneyVel;

        chimney.body.immovable = true;
    },

    displayEnd: function(win) {
        // you can't win and lose at the same time
        if (this.endText && this.endText.exists) {
            return;
        }

        var msg = win ? 'You Win!!!' : 'Game Over!';
        this.endText = this.add.text(
            this.game.width / 2, this.game.height / 2 - 60, msg, {
                font: '72px serif',
                fill: '#fff'
            }
        );
        this.endText.anchor.setTo(0.5, 0);



    },

    endGame: function() {

        //  Here you should destroy anything you no longer need.
        //  Stop music, delete sprites, purge caches, free resources, all that good stuff.

        //this.pie.destroy();
        //  Then let's go back to the main menu.
        this.scoreText.text = 'Score: ' + this.score;

        score = this.score;

        this.state.start('MainMenu', true, false, score);

    }

};
