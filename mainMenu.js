BasicGame.MainMenu = function(game) {

    this.music = null;
    this.playButton = null;


};

BasicGame.MainMenu.prototype = {

    init: function(score) {
        this.score = score;
    },

    create: function() {
         this.stage.backgroundColor = '#11699c';
        this.add.sprite(0, -100, 'sky');

        this.cloud = this.add.sprite(this.game.width, 200, 'cloud');
        this.physics.enable(this.cloud, Phaser.Physics.ARCADE);
        this.cloud.body.velocity.x = -50;

        //  We've already preloaded our assets, so let's kick right into the Main Menu itself.
        //  Here all we're doing is playing some music and adding a picture and button
        //  Naturally I expect you to do something significantly better :)

        //this.add.tilesprite(0, 0, 800, 600, 'chimney');

        this.gameOverText = this.add.text(this.game.width / 2, this.game.height / 2 - 80, "Game over!", {
            font: "80px monospace",
            fill: "#fff"
        });
        this.gameOverText.anchor.setTo(0.5, 0.5);
        this.loadingText = this.add.text(this.game.width / 2, this.game.height / 2, 'Score: ' + this.score, {
            font: "40px monospace",
            fill: "#fff"
        });
        this.loadingText.anchor.setTo(0.5, 0.5);
        this.loadingTextTwo = this.add.text(this.game.width / 2, this.game.height / 2 + 80, 'Press Z to try again', {
            font: "30px monospace",
            fill: "red"
        });
        this.loadingTextTwo.anchor.setTo(0.5, 0.5);


    },

    update: function() {

        if (this.input.keyboard.isDown(Phaser.Keyboard.Z) {
            this.score === 0;
            this.startGame();
        }
    },

    render: function() {
        this.game.debug.body(this.loadingText);
    },

    startGame: function(pointer) {

        //  Ok, the Play Button has been clicked or touched, so let's stop the music (otherwise it'll carry on playing)
        // this.music.stop();

        //  And start the actual game
        this.score = 0;
        var score = this.score;
        this.state.start('Game');

    }

};
