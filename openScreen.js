BasicGame.OpenScreen = function(game) {

    this.music = null;
    this.playButton = null;

};

BasicGame.OpenScreen.prototype = {

    create: function() {

        //  We've already preloaded our assets, so let's kick right into the Main Menu itself.
        //  Here all we're doing is playing some music and adding a picture and button
        //  Naturally I expect you to do something significantly better :)

        //this.add.tilesprite(0, 0, 800, 600, 'chimney');

        this.stage.backgroundColor = '#11699c';
        this.add.sprite(0, 0, 'sky');

        this.cloud = this.add.sprite(this.game.width, 200, 'cloud');
        this.physics.enable(this.cloud, Phaser.Physics.ARCADE);
        this.cloud.body.velocity.x = -50;

        this.music = this.game.add.audio('titleTrack');
        this.music.play();

        this.title = this.add.sprite(this.game.width / 2, 100, 'title');
        this.title.anchor.setTo(0.5, 0.5);

        this.instr1 = this.add.text(this.game.width / 2, 250, "Get Santa as far down the chimney as you can!", {
            font: "20px monospace",
            fill: "#fff"
        });
        this.instr1.anchor.setTo(0.5, 0.5);

        this.instr2 = this.add.text(this.game.width / 2, 300, "Avoid the mince pies, they'll make you fatter!", {
            font: "20px monospace",
            fill: "#fff"
        });
        this.instr2.anchor.setTo(0.5, 0.5);

        this.instr3 = this.add.text(this.game.width / 2, 350, "Collect presents to increase your multiplier", {
            font: "20px monospace",
            fill: "#fff"
        });
        this.instr3.anchor.setTo(0.5, 0.5);

        this.loadingText = this.add.text(this.game.width / 2, 520, "Press Z to start!", {
            font: "bold 30px monospace",
            fill: "red",
            buttonMode: "true"
        });
        this.loadingText.anchor.setTo(0.5, 0.5);
    },

    update: function() {

        if (this.input.keyboard.isDown(Phaser.Keyboard.Z)) {
            this.startGame();
        }

        if (this.cloud.position.x < -250) {
            var cloudHeight = this.game.rnd.integerInRange(20, 200);
            this.cloud.body.position.y = cloudHeight;
            this.cloud.body.position.x = 900

        }
        //  Do some nice funky main menu effect here

    },

    startGame: function(pointer) {

        //  Ok, the Play Button has been clicked or touched, so let's stop the music (otherwise it'll carry on playing)
        // this.music.stop();

        //  And start the actual game
        this.state.start('Game');

    }

};
