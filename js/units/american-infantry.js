var AmericanInfantry = function(game) {

    this.game = game;


};


AmericanInfantry.prototype = {

    preload: function() {

        // walking animations
        this.load.spritesheet('usa-walk-e',
            'assets/soldiers/american/T-INFANTRY C-USA A-WALK D-E.png', 160, 160);
        this.load.spritesheet('usa-walk-e',
            'assets/soldiers/american/T-INFANTRY C-USA A-WALK D-SE.png', 160, 160);
        this.load.spritesheet('usa-walk-e',
            'assets/soldiers/american/T-INFANTRY C-USA A-WALK D-S.png', 160, 160);
        this.load.spritesheet('usa-walk-e',
            'assets/soldiers/american/T-INFANTRY C-USA A-WALK D-SW.png', 160, 160);
        this.load.spritesheet('usa-walk-e',
            'assets/soldiers/american/T-INFANTRY C-USA A-WALK D-W.png', 160, 160);
        this.load.spritesheet('usa-walk-e',
            'assets/soldiers/american/T-INFANTRY C-USA A-WALK D-NW.png', 160, 160);
        this.load.spritesheet('usa-walk-e',
            'assets/soldiers/american/T-INFANTRY C-USA A-WALK D-N.png', 160, 160);
        this.load.spritesheet('usa-walk-e',
            'assets/soldiers/american/T-INFANTRY C-USA A-WALK D-NE.png', 160, 160);

        this.game.input.keyboard.addKeyCapture([Phaser.Keyboard.W]);

    },
    create: function() {




    }





};