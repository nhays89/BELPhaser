var game = new Phaser.Game("100%", "100%", Phaser.CANVAS, '', null,true,false);

game.state.add('load', loadState);
game.state.add('menu', menuState);
game.state.add('play', playState);

game.state.start('load');
