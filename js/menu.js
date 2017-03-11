WebFontConfig = {
    google: {
        families: ['Roboto']
    }
};

var menuState = {
    init: function(message) {
        if (message) {
            var messageLabel = game.add.text(80, game.world.height - 160, message);
        }
    },
    preload: function () {
        //  Load the Google WebFont Loader script
        game.load.script('webfont', '//ajax.googleapis.com/ajax/libs/webfont/1.4.7/webfont.js');
    },
    create: function () {
        var nameLabel = game.add.text(80, 80, 'Behind Enemy Lines',
            { font: '50px Roboto', fill: '#000000' });

        var instructionsLabel = game.add.text(80,  200, 'Last as long as possible against the soviets \n' +
            'with your squad of Americans. To control your units, \n' +
            'drag with the left mouse to select and right click to move \n' +
            'to or attack enemies. Move around the map \nwith \'WASD\' keys. You can pause the game\n' +
            'with the \'P\' key',
            { font: '20px Roboto', fill: '#000000' });

        var startLabel = game.add.text(80, game.world.height - 80,
            'press "SPACE" key to start...', { font: '25px Roboto', fill: '#000000' });

        var spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

        spaceKey.onDown.addOnce(this.start, this);
    },
    start: function () {
        game.state.start('play');
    }

};