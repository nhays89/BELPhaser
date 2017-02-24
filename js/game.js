var game = new Phaser.Game(1920, 1080, Phaser.CANVAS, 'test', null, true, false);

game.state.add('boot', bootState);
game.state.add('load', loadState);
game.state.add('menu', menuState);
game.state.add('play', playState);

//game.state.start('boot');
game.state.start('load');

