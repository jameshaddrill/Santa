BasicGame.Preloader = function(game) {

    this.background = null;
    this.preloadBar = null;

    //this.ready = false;

};

BasicGame.Preloader.prototype = {

    preload: function() {

        //  Show the loading progress bar asset we loaded in boot.js
        //   this.stage.backgroundColor = '#2d2d2d';
        this.load.audio('titleTrack', ['assets/noel.mp3', 'assets/noel.ogg']);

        this.preloadBar = this.add.sprite(this.game.width / 2 - 100, this.game.height / 2, 'preloaderBar');
        this.add.text(this.game.width / 2, this.game.height / 2 - 30, "Loading...", {
            font: "32px monospace",
            fill: "#fff"
        }).anchor.setTo(0.5, 0.5);

        //  This sets the preloadBar sprite as a loader sprite.
        //  What that does is automatically crop the sprite from 0 to full-width
        //  as the files below are loaded in.
        this.load.setPreloadSprite(this.preloadBar);

        //  Here we load the rest of the assets our game needs.
        this.load.image('bg', 'assets/bg.png');
        this.load.image('chimney', 'assets/chimney.png');
        this.load.image('mincepie', 'assets/mince_pie.png', 30, 21);
        this.load.image('present', 'assets/present.png');
        this.load.image('roof', 'assets/roof.png', 800, 320);
        this.load.image('sky', 'assets/sky.png', 800, 320);
        this.load.image('cloud', 'assets/cloud.png');
        this.load.image('fb', 'assets/fb.png');
        this.load.spritesheet('player', 'assets/santa.png', 64, 67);
        this.load.spritesheet('playerSm', 'assets/santatwo.png', 75, 78);
        this.load.spritesheet('playerMd', 'assets/santathree.png', 80, 83);
        this.load.image('title', 'assets/title.png');



        /* this.load.audio('explosion', ['assets/explosion.ogg', 'assets/explosion.wav']);
         this.load.audio('playerExplosion', ['assets/player-explosion.ogg', 'assets/player-explosion.wav']);
         this.load.audio('enemyFire', ['assets/enemy-fire.ogg', 'assets/enemy-fire.wav']);
         this.load.audio('playerFire', ['assets/player-fire.ogg', 'assets/player-fire.wav']);
         this.load.audio('powerUp', ['assets/powerup.ogg', 'assets/powerup.wav']);
         //this.load.audio('titleMusic', ['audio/main_menu.mp3']);
         //  + lots of other required assets here */

    },


    create: function() {

        //  Once the load has finished we disable the crop because we're going to sit in the update loop for a short while as the music decodes
        this.preloadBar.cropEnabled = false;
        this.state.start('OpenScreen');
    }

    /*,

    update: function () {

      //  You don't actually need to do this, but I find it gives a much smoother game experience.
      //  Basically it will wait for our audio file to be decoded before proceeding to the MainMenu.
      //  You can jump right into the menu if you want and still play the music, but you'll have a few
      //  seconds of delay while the mp3 decodes - so if you need your music to be in-sync with your menu
      //  it's best to wait for it to decode here first, then carry on.

      //  If you don't have any music in your game then put the game.state.start line into the create function and delete
      //  the update function completely.

      //if (this.cache.isSoundDecoded('titleMusic') && this.ready == false)
      //{
      //  this.ready = true;

      //}

    } */

};
