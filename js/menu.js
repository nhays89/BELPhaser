var menuState = {

    create: function () {
        var nameLabel = game.add.text(80, 80, 'Behind Enemy Lines',
            { font: '50px Arial', fill: '#000000' });

        var startLabel = game.add.text(80, game.world.height - 80,
            'press "SPACE" key to start...', { font: '25px Arial', fill: '#000000' });

        var spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

        spaceKey.onDown.addOnce(this.start, this);
    },
    start: function () {
        game.state.start('play');
    }

}